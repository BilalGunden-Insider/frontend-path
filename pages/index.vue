<script setup>
import { ref } from 'vue'

const searchTerm = ref('');

const handleSearch = (term) => {
  searchTerm.value = term;
};
</script>

<template>
  <Navbar/>
  <HomeSection @update-search="handleSearch" />
  <RecommenderItem :search-term="searchTerm" />
</template>