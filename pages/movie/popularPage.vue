<script setup>
import { ref, watch } from 'vue';
import NavItem from '../../components/Navbar.vue';
import PageContentView from '../../components/pageLayout/PageInfoLayout.vue';
import SideBarView from '../../components/pageLayout/SideBarLayout.vue';
import { fetchMovies } from '../../components/FetchFunctions/fetchMovies';

const movies = ref([]);
const selectedSort = ref('desc');
const selectedFilter = ref('28');

const fetchPopularMovies = async () => {
  const popularEndpoint = `https://api.themoviedb.org/3/discover/movie?api_key=348088421ad3fb3a9d6e56bb6a9a8f80&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.${ selectedSort.value }&with_genres=${ selectedFilter.value }`;

  movies.value = await fetchMovies(popularEndpoint);
}

watch([selectedSort, selectedFilter], () => {
  fetchPopularMovies();
});

fetchPopularMovies();
</script>

<template>
  <NavItem/>
  <div class="main-container flex flex-row p-5">
    <SideBarView :page-title="'Popular'" :selected-sort="selectedSort" :selected-filter="selectedFilter" @update-sort="selectedSort = $event" @update-filter="selectedFilter = $event" />
    <PageContentView :movies="movies" />
  </div>
</template>