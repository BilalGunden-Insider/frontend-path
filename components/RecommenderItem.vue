<script setup>
import { ref, watch, onMounted, defineProps } from 'vue'
import CardItem from './pageLayout/CardItem.vue'
import { fetchMovies } from './FetchFunctions/fetchMovies.js';

const props = defineProps({
  searchTerm: String
});

const movies = ref([]);
const currentSelection = ref('popular')
const popularEndpoint = 'https://api.themoviedb.org/3/discover/movie?api_key=348088421ad3fb3a9d6e56bb6a9a8f80&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
const topRatedEndpoint = 'https://api.themoviedb.org/3/discover/movie?api_key=348088421ad3fb3a9d6e56bb6a9a8f80&include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200'

const fetchPopularMovies = async () => {
  movies.value = await fetchMovies(popularEndpoint);
  currentSelection.value = 'popular';
}

const fetchTopRatedMovies = async () => {
  movies.value = await fetchMovies(topRatedEndpoint);
  currentSelection.value = 'top-rated';
}

watch(() => props.searchTerm, async (newTerm) => {
  console.log(newTerm.length)
  if (newTerm && newTerm.length >= 3) {
    movies.value = await fetchMovies(`https://api.themoviedb.org/3/search/movie?api_key=348088421ad3fb3a9d6e56bb6a9a8f80&query=${ newTerm }&include_adult=false&language=en-US&page=1`);
  } else if (newTerm.length === 0) {
    await fetchPopularMovies();
  }
});

onMounted(() => {
  fetchPopularMovies();
});
</script>

<template>
  <div class="mt-4 flex flex-col flex-wrap content-around">
    <div class="flex items-center">
      <h2 class="mr-5 font-semibold text-xl">What's Popular</h2>
      <div class="flex items-center justify-center">
        <div class="relative flex w-64 h-10 border border-[#032540] rounded-full overflow-hidden cursor-pointer">
          <div class="absolute top-0 left-0 h-full w-1/2 bg-[#032540] rounded-full transition-transform duration-300" :class="currentSelection === 'popular' ? 'translate-x-0' : 'translate-x-full'"></div>
          <div class="relative flex-1 text-center px-4 py-2 text-sm font-medium transition-colors duration-300"  :class="currentSelection === 'popular' ? 'text-white' : 'text-[#2c4f6a]'" @click="fetchPopularMovies" >
            Popular
          </div>
          <div class="relative flex-1 text-center px-4 py-2 text-sm font-medium transition-colors duration-300" :class="currentSelection === 'top-rated' ? 'text-white' : 'text-[#2c4f6a]'" @click="fetchTopRatedMovies">
            Top Rated
          </div>
        </div>
      </div>
    </div>
    <div class="w-full gap-2 overflow-scroll">
      <div class="h-max w-fit flex">
        <CardItem v-for="movie in movies" :key="movie.id" :movie="movie" />
      </div>
    </div>
  </div>
</template>
