require('dotenv').config()
const puppeteer = require('puppeteer')
const fs = require('fs')

const scrapeMediamarkt = async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  )
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false })
  })
  await page.setViewport({ width: 1080, height: 980 })

  let allProducts = []
  let hasNextPage = true
  let pageIndex = 1

  while (hasNextPage) {
    const url = `${process.env.URL_BROWSER}?page=${pageIndex}`
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    } catch (error) {
      console.log(`Error al navegar a la página ${pageIndex}:`, error)
      break
    }

    try {
      await page.waitForSelector('#pwa-consent-layer-form', {
        timeout: 5000
      })
      await page.click('#pwa-consent-layer-accept-all-button')
    } catch (error) {
      console.log('THERE IS NOT MODAL COOKIES BABY🤣')
    }

    await scroll(page)

    const products = await page.evaluate(() => {
      let productData = []
      const productElements = document.querySelectorAll('.sc-b0c0d999-0')
      productElements.forEach((product) => {
        const name = product.querySelector(
          '[data-test="product-title"]'
        )?.innerText
        const price = product.querySelector('.sc-e0c7d9f7-0')?.innerText
        const imageUrl = product.querySelector(
          '[data-test="product-image"] img'
        )?.src
        if (name && price && imageUrl) {
          productData.push({ name, price, imageUrl })
        }
      })
      return productData
    })

    allProducts = allProducts.concat(products)

    hasNextPage = await page.evaluate(() => {
      const nextButton = document.querySelector(
        '[data-test="mms-search-srp-loadmore"]'
      )
      return nextButton && !nextButton.disabled
    })

    const btnExist = await page.evaluate(() => {
      const nextButton = document.querySelector(
        '[data-test="mms-search-srp-loadmore"]'
      )
      return nextButton && !nextButton.disabled
    })
    console.log(btnExist)

    if (!btnExist) hasNextPage = false
    pageIndex++
  }

  await browser.close()

  writeDoc(allProducts)
}

const writeDoc = (newProducts) => {
  let existingProducts = []

  if (fs.existsSync('products.json')) {
    const existingData = fs.readFileSync('products.json')
    existingProducts = JSON.parse(existingData)
  }

  const allProducts = existingProducts.concat(newProducts)

  fs.writeFileSync('products.json', JSON.stringify(allProducts, null, 2))
  console.log('Datos guardados en products.json')
}

const scroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0
      const distance = 100 // distancia a scroll cada vez
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance
        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 100)
    })
  })
}

scrapeMediamarkt()
