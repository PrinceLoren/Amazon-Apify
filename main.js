const Apify = require('apify');

Apify.main(async () => {

  const keyword = 'phone'

  const StartUrl = 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords='

  const StartProductUrl = 'https://www.amazon.com/dp/'

  const StartOfferUrl = 'https://www.amazon.com/gp/offer-listing/'

  const requestQueue = await Apify.openRequestQueue()

  await requestQueue.addRequest({
    url: StartUrl + keyword,
    userData: {
      label: 'start',
      keyword
    }

  })

  const crawler = new Apify.PuppeteerCrawler({
    requestQueue,
    handlePageFunction: async ({ page, request }) => {

        if (request.userData.label === 'start') {
          console.log('Start page is:', request.url)

          try {
            const asins = await page.$$eval('.s-result-item', async (items) => {
                return items.map((item) => item.dataset.asin).filter((item) => item !== '' && item !== undefined)
            })


          const items = asins.map((asin) => {
            const productUrl = StartProductUrl + asin
            const sellerUrl = StartOfferUrl + asin
            return {asin, productUrl, sellerUrl, keyword: request.userData.keyword}
          })

          for (const item of items) {
            await requestQueue.addRequest({
              url: item.productUrl,
              userData: {
                label: 'product',
                asin: item.asin,
                keyword: item.keyword,
                productUrl: item.productUrl,
                sellerUrl: item.sellerUrl
              }
            })
          }
        } catch (err) {
          console.log(err)
          await dataset.pushData({
              url: request.url,
              status: 'No results',
          });
        }

        console.log('Keep crawl.')
      }


      else if (request.userData.label === 'product') {
        console.log('Going to product page: ' + request.url)


        const PageInfo  = await page.evaluate(() => {

            const titleEl = document.getElementById('productTitle')

            if (!titleEl) {
                return false
            }

            const title = titleEl.innerText
            const url = document.URL
            const description = document.getElementById('productDescription') ? document.getElementById('productDescription').innerText : 'No description.'



            return { title, url, description }
        })

        const { asin, keyword, productUrl } = request.userData

        await requestQueue.addRequest({
          url: request.userData.sellerUrl,
          userData: {
            label: 'seller',
            asin,
            keyword,
            productUrl,
            title: PageInfo.title,
            description: PageInfo.description
          }
        })
        console.log('End with ' + request.url)
      }
          const { asin, keyword, productUrl, title, description, offers } = request.userData
          const item = { title, itemUrl: productUrl, description,keyword,asin,offers}

          await Apify.pushData(item)

    },
    handleFailedRequestFunction: async ({ request }) => {
        console.log(`Request ${request.url} failed 4 times`)

        await Apify.pushData({
            url: request.url,
            errors: request.errorMessages,
        })
    }
  })

  await crawler.run()
})
