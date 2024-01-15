const parentElement = document.querySelector(".main");
const searchInput = document.querySelector(".input");
const movieRatings= document.querySelector("#rating-select");
const movieGenre = document. querySelector("#genre-select")

const URL = "https://raw.githubusercontent.com/theapache64/top250/master/top250.json";

let raitings =0;
let searchValue = "";
let filteredArrayOfMovies = [];
let genre="";

const getMovies = async (url) => {
    try {
    const { data} = await axios.get(url);
    return data;
    } catch (err) {}
    };

const movies = await getMovies(URL);
console.log(movies);


const createElement = (element)=>document.createElement(element)

//Function that creates movie card
const createMovieCard = (movies)=>{
    for(let movie of movies ){

        //parent element
        const cardContainer = document.createElement("div");
        cardContainer.classList.add("card","shadow");


        //image container
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("card-image-container");

        const image = document.createElement("img");
        image.classList.add("card-image");
        image.setAttribute("src",movie.image);
        image.setAttribute("alt",movie.name);

        imageContainer.appendChild(image);
        cardContainer.appendChild(imageContainer);

        //Card Detials Container 
        const cardDetailsContainer = document.createElement("div");
        cardDetailsContainer.classList.add("movie-details");

        //title
        const title = document.createElement("p");
        title.classList.add("title");
        title.innerText = movie.name;
        cardDetailsContainer.appendChild(title);

        //genre
        const genre = document.createElement("p");
        genre.classList.add("genre");
        genre.innerText = `Genre : ${movie.genre}`
        cardDetailsContainer.appendChild(genre);

        //Rating and Length Container
        const ratingContainer = document.createElement("div");
        ratingContainer.classList.add("raitings");

        //Star Icon container
        const starRatingContainer = document.createElement("div");
        starRatingContainer.classList.add("star-ratings");

        //Star Icon
        const starEle = document.createElement("span");
        starEle.classList.add("material-icons-outlined");
        starEle.innerText="star";
        starRatingContainer.appendChild(starEle);

        const rating = document.createElement("span");
        rating.innerText = movie.aggregateRating.ratingValue
        starRatingContainer.appendChild(rating);

        ratingContainer.appendChild(starRatingContainer);

        //Length

        const Length = document.createElement("p");
        Length.innerText = `${movie.duration} `;

        
        ratingContainer.appendChild(Length);

       cardDetailsContainer.appendChild(starRatingContainer);

       cardContainer.appendChild(cardDetailsContainer);

       parentElement.appendChild(cardContainer);




}
}

function getFilteredData(){
    let filteredArrayOfMovies = searchValue?.length>0 ? movies.filter((movie) => 
    searchValue === movie.name.toLowerCase() ||
    movie.keywords.toLowerCase().split(",").includes(searchValue) ||
    movie.genre.join().toLowerCase().split(",").includes(searchValue)
    ) : movies

    if(raitings){
        filteredArrayOfMovies = searchValue?.length >0 ?filteredArrayOfMovies : movies;
        filteredArrayOfMovies = filteredArrayOfMovies.filter((movie)=> movie.aggregateRating.ratingValue >= raitings)

    }
    if(genre?.length>0){
        filteredArrayOfMovies = searchValue?.length>0  || raitings>7 ?filteredArrayOfMovies :movies;
        filteredArrayOfMovies = filteredArrayOfMovies.filter((movie)=>movie.genre.includes(genre))
    }
    return filteredArrayOfMovies;
    
}

function handleSearch(event){
    let searchValue = event.target.value.toLowerCase();
    let filterBySearch = getFilteredData();
    parentElement.innerHTML="";
    createMovieCard(filterBySearch);

}

function handleRatingSelector(event){
     raitings = event.target.value ;
     let filterByRating = getFilteredData();
     parentElement.innerHTML="";
     createMovieCard(raitings ? filterByRating:movies);
}

function debounce(callback,delay=500){
    let timerId;

    return(...args)=>{
        clearTimeout(timerId);
        timerId= setTimeout(()=>{
            callback(...args);
        },delay);
    };
}
const debounceInput = debounce(handleSearch,500);




searchInput.addEventListener("keyup",debounceInput);

movieRatings.addEventListener("change",handleRatingSelector);




const genres = movies.reduce((acc,cur)=>{
    let genresArr=[];
    let tempGenresArr = cur.genre;
    acc=[...acc,...tempGenresArr];
    for(let genre of acc){
        if(!genresArr.includes(genre)){
            genresArr = [...genresArr,genre];
        }
    }
    return genresArr;
},[]);

for(let genre of genres){
    const option = createElement("option")
    option.classList.add("option");
    option.setAttribute("value",genre);
    option.innerText = genre;
    movieGenre.appendChild(option);
}

function handleGenreSelect(event){
    genre = event.target.value;
    let filterByGenre = getFilteredData();
    parentElement.innerHTML="";
    createMovieCard(filterByGenre);
}

movieGenre.addEventListener("change",handleGenreSelect)

createMovieCard(movies);