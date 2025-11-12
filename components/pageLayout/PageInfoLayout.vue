<script setup lang="ts">
import CardItem from './CardItem.vue';

defineProps({
  movies: Array
});
</script>

<template>
  <div class="content-wrapper p-5 flex flex-wrap justify-between">
    <CardItem v-for="movie in movies" :key="movie.id" :movie="movie" />
  </div>
</template>