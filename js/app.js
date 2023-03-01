/* sort todays pick and trending */
let fetchData = [];

const fetchCategories = () =>{
    fetch('https://openapi.programming-hero.com/api/news/categories')
    .then(res => res.json())
    .then(data => displayCategories(data.data.news_category))
}

const displayCategories = (data) =>{
    // console.log(data)
    const categoriesContainer = document.getElementById('categories-container')
    data.forEach(singleCategory => {
        categoriesContainer.innerHTML += `<a class="nav-link" href="#" onclick="fetchCategoryNews('${singleCategory?.category_id}','${singleCategory.category_name}')" >${singleCategory?.category_name}</a>`
        /* alt 1)create p,2)innerhtml p,3)append p */

    });
}

// fetch all news form single category

const fetchCategoryNews = (category_id, category_name) =>{
    // console.log(category_id)
    const url = `https://openapi.programming-hero.com/api/news/category/${category_id}`
    fetch(url)
    .then(res => res.json())
    .then(data => {

        fetchData = data.data;
        displayAllNews(data.data, category_name)
    
    })
}

const displayAllNews = (data, category_name) =>{
    // console.log(data,category_name)
    document.getElementById('news-count').innerHTML = data.length
    document.getElementById('category-name').innerHTML = category_name
    
    const allNewsContainer = document.getElementById('all-news')
    document.getElementById('all-news').innerHTML =''/* to clear prev results */
data.forEach((singleNews) =>{
    // const {image_url,title,details,author.name,author.published_date,total_view,rating.number } = singleNews;
// console.log(singleNews,'sadasd')
    allNewsContainer.innerHTML += ` <div class="card mb-3">
    <div class="row g-0">
      <div class="col-md-4">
        <img src="${singleNews.image_url}" class="img-fluid rounded-start" alt="...">
      </div>
      <div class="col-md-8 d-flex flex-column">
        <div class="card-body">
          <h5 class="card-title">${singleNews.title}</h5>
          <p class="card-text">${singleNews.details.slice(0,400)} . . .</p>
          
        </div>
        <div class="card-footer border-0 bg-body d-flex justify-content-between">
            <div class="d-flex gap-2">
        <img src="${singleNews.author.img}" class="img-fluid rounded-circle" alt="..." height="40" width = "50">
        <div>
        <p class="m-0 p-0">${singleNews.author.name} . . .</p>
        <p class="m-0 p-0">${singleNews.author.published_date} . . .</p>
        </div>
            </div>
            <div class="d-flex align-items-center">
            <i class="fas fa-eye"></i>
        
            <p class="m-0 p-0">${singleNews.total_view ? singleNews.total_view : "Not available"}</p>
            </div>
            
    <div class="d-flex gap-2">
       
        ${generateStars(singleNews.rating.number)}
        <p>${singleNews.rating.number}</p>
    </div>

    <div>  
        <i class="fas fa-arrow-right" onclick="fetchNewsDetail('${singleNews._id}')" data-bs-toggle="modal"
        data-bs-target="#exampleModal"></i>
    </div>
        </div>

      </div>
    </div>
  </div>`
})
}

const fetchNewsDetail = (news_id) =>{
    let url= `https://openapi.programming-hero.com/api/news/${news_id}`
    fetch(url)
    .then(res => res.json())
    .then(data => showNewsDetail(data.data[0]))
}

const showNewsDetail = (newsDetail) => {
  //
  const { _id, image_url, title, details, author, total_view, others_info } =
    newsDetail;

  document.getElementById("modal-body").innerHTML = `
    <div class= "card mb-3">
    <div class="row g-0">
      <div class="col-md-12">
        <img src=${image_url} class="img-fluid rounded-start" alt="..." />
      </div>
      <div class="col-md-12 d-flex flex-column">
        <div class="card-body">
          <h5 class="card-title">${title} <span class="badge text-bg-danger">
          ${others_info.is_trending ? "Trending" : "Not trending"}</span></h5>
          <p class="card-text">
            ${details}
          </p>
          
        </div>
        <div class="card-footer border-0 bg-body d-flex justify-content-between">
          <div class="d-flex gap-2">
          <img src=${author.img
      } class="img-fluid rounded-circle" alt="..." height="40" width="40"/>
          <div>
          <p class="m-0 p-0">${author.name ? author.name : "Not available"}</p>
          <p class="m-0 p-0">${author.published_date}</p>
          </div>
          
          </div>
          <div class="d-flex align-items-center">
              <i class="fas fa-eye"></i>
              
              <p class="m-0 p-0">${total_view}</p>
          </div>
          <div>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star-half"></i>
              <p>${newsDetail.rating.number}</p>
          </div>
          
        </div>
      </div>
    </div>
    </div>
    `;
};



// show trendings
const showTrendings = () =>{
    const trendingNews = fetchData.filter(singleData => singleData.others_info.is_trending === true)
    const category_name = document.getElementById('category-name').innerHTML


    displayAllNews(trendingNews, category_name+" in Trending")
}


// generate stars

const generateStars = rating => {
    let ratingHTML ='';
    for (let i=1; i <= Math.floor(rating); i++){

        ratingHTML += `<i class="fas fa-star"></i>` 

    }
    if(rating - Math.floor(rating)>0){
        ratingHTML += `<i class="fas fa-star-half"></i>` 
    }
    return ratingHTML
}