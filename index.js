(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []

  const dataPanel = document.getElementById('data-panel')
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12

  const showmodel = document.getElementById('showmodel')
  let showStyle = 'card'
  let nowPage = 1
  let paginationData = []

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    getTotalPages(data)
    // displayDataList(data)
    getPageData(nowPage, data)
  }).catch((err) => console.log(err))

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
      console.log('event.target.dataset.id', event.target.dataset.id)
    }
  })

  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      if (showStyle === 'card') {
        htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
            </div>
            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
      } else if (showStyle === 'list') {
        htmlContent += `
        <div class="col-sm-12 clearfix">
          <div class="mb-2">
            <div class="col-8 col-sm-10 movie-item-body">
              <h6 class="card-title">${item.title}</h6>
            </div>

            <!-- "More" button -->
            <div class="col-4 col-sm-2">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
      }

    })
    dataPanel.innerHTML = htmlContent
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    console.log('data', data)
    console.log('movie', movie)
    console.log('list', list)

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  // listen to search btn click event
  searchBtn.addEventListener('click', event => {
    let results = []
    event.preventDefault()

    console.log('click!')
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    console.log('results', results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(nowPage, results)
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log('event.target.dataset.page', event.target.dataset.page)
    console.log(event.target)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
      nowPage = event.target.dataset.page
    }
  })

  // showmodel click event
  showmodel.addEventListener('click', event => {
    console.log(event.target)

    if (event.target.matches('.fa-th')) {
      showStyle = 'card'
      console.log(showStyle)

      const regex = new RegExp(searchInput.value, 'i')
      results = data.filter(movie => movie.title.match(regex))
      console.log('results', results)
      getTotalPages(results)
      getPageData(nowPage, results)

    } else if (event.target.matches('.fa-bars')) {
      showStyle = 'list'
      console.log(showStyle)

      const regex = new RegExp(searchInput.value, 'i')
      results = data.filter(movie => movie.title.match(regex))
      console.log('results', results)
      getTotalPages(results)
      getPageData(nowPage, results)
    }
  })


})()

