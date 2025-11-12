<script setup>
const moviesHover = ref(false);
const tvShowsHover = ref(false);
const peopleHover = ref(false);
const moreHover = ref(false);
const plusTooltip = ref(false);

const openExternalLink = (url) => {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank');
  }
};
</script>

<template>
  <div id="app">
    <header class="flex justify-around items-center px-6 py-4 bg-[#032540] text-white">
      <div class="flex items-center space-x-8">
        <RouterLink to="/"><img src="/icon/movieIcon.svg" class="w-44 h-auto" alt="MovieApp" /></RouterLink>
        <nav class="flex space-x-6">
          <div @mouseover="moviesHover= true; tvShowsHover= false; peopleHover= false; moreHover= false" class="nav-link-item cursor-pointer">
            Movies
            <div v-show="moviesHover" @mouseleave="moviesHover = false" class="absolute z-20 under-link-container bg-white p-2 mt-2 text-slate-950 flex flex-col gap-2">
              <div class="under-link-item"><RouterLink to="/movie/popularPage">Popular</RouterLink></div>
              <div class="under-link-item"><RouterLink to="/movie/upcomingPage">Upcoming</RouterLink></div>
              <div class="under-link-item"><RouterLink to="/movie/topRatedPage">Top Rated</RouterLink></div>
            </div>
          </div>
          <div @mouseover="tvShowsHover= true; moviesHover= false; peopleHover= false; moreHover= false" class="nav-link-item cursor-pointer">
            TV Shows
            <div v-show="tvShowsHover" @mouseleave="tvShowsHover = false" class="absolute z-20 under-link-container bg-white p-2 mt-2 text-slate-950 flex flex-col gap-2">
              <div class="under-link-item"><RouterLink to="/tvShow/popularPage">Popular</RouterLink></div>
              <div class="under-link-item"><RouterLink to="/tvShow/upcomingPage">Upcoming</RouterLink></div>
              <div class="under-link-item"><RouterLink to="/tvShow/topRatedPage">Top Rated</RouterLink></div>
            </div>
          </div>
          <div @mouseover="peopleHover= true; moviesHover= false; tvShowsHover= false; moreHover= false" class="nav-link-item cursor-pointer">
            People
            <div v-show="peopleHover" @mouseleave="peopleHover = false" class="absolute z-20 under-link-container bg-white p-2 mt-2 text-slate-950 flex flex-col gap-2">
              <div class="under-link-item"><a href="https://www.themoviedb.org/person" target="_blank" rel="noopener noreferrer">Popular People</a></div>
            </div>
          </div>
          <div @mouseover="moreHover= true; moviesHover= false; tvShowsHover= false; peopleHover= false" class="nav-link-item cursor-pointer">
            More
            <div v-show="moreHover" @mouseleave="moreHover = false" class="absolute z-20 under-link-container bg-white p-2 mt-2 text-slate-950 flex flex-col gap-2">
              <div class="under-link-item"><a href="https://www.themoviedb.org/discuss" target="_blank" rel="noopener noreferrer">Discussions</a></div>
              <div class="under-link-item"><a href="https://www.themoviedb.org/leaderboard" target="_blank" rel="noopener noreferrer">Leaderboard</a></div>
              <div class="under-link-item"><a href="https://www.themoviedb.org/talk" target="_blank" rel="noopener noreferrer">Support</a></div>
              <div class="under-link-item"><a href="https://developer.themoviedb.org/docs" target="_blank" rel="noopener noreferrer">API Documentation</a></div>
              <div class="under-link-item"><a href="https://www.themoviedb.org/api-for-business" target="_blank" rel="noopener noreferrer">API for Business</a></div>
            </div>
          </div>
        </nav>
      </div>

      <div class="flex items-center space-x-8">
        <div class="relative">
          <img 
            src="/icon/plus.svg" 
            class="w-6 h-6 cursor-pointer" 
            alt="Add"
            @click="plusTooltip = !plusTooltip"
          />
          <div 
            v-show="plusTooltip" 
            class="absolute z-30 bg-white text-slate-950 p-3 mt-2 rounded shadow-lg whitespace-nowrap tooltip-arrow"
            style="left: 50%; transform: translateX(-50%); margin-top: 16px;"
          >
            Can't find a movie or TV show? Login to create it.
          </div>
        </div>
        <button class="border border-white rounded px-3 py-1">EN</button>
        <button @click="openExternalLink('https://www.themoviedb.org/login')">Login</button>
        <button @click="openExternalLink('https://www.themoviedb.org/signup')">Join TMDB</button>
        <button>
          <img src="/icon/search.svg" class="w-6 h-6" alt="Search" />
        </button>
      </div>
    </header>
  </div>
</template>

<style scoped>
/* Image fixes */
img {
  display: block;
  max-width: 100%;
  height: auto;
}

.under-link-container {
  min-width: 140px;
  border-radius: 8px;
}

.under-link-item {
  font-size: 14px;
  font-family: sans-serif;
  color: #000;
  font-weight: 400;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.under-link-item:hover {
  background-color: #e3e4e5eb;
}

.tooltip-arrow::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
}
</style>