<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  pageTitle: String,
  selectedSort: String,
  selectedFilter: String
});

const emit = defineEmits(['update-sort', 'update-filter']);
const sortValue = ref(props.selectedSort);
const filterValue = ref(props.selectedFilter);

watch(sortValue, (newVal) => {
  emit('update-sort', newVal);
});

watch(filterValue, (newVal) => {
  emit('update-filter', newVal);
});

const { pageTitle } = props;
</script>

<template>
  <div class="sidebar-container bg-white shadow-lg rounded-lg p-6 w-full max-w-xs">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ pageTitle }}</h2>
      <div class="w-12 h-1 bg-blue-500 rounded"></div>
    </div>

    <div class="mb-8">
      <div class="flex items-center mb-4">
        <i class="pi pi-sort text-blue-500 mr-2"></i>
        <h3 class="text-lg font-semibold text-gray-700">Sort</h3>
      </div>
      <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-600">Sort Results By</label>
        <select 
          v-model="sortValue" 
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-700"
          name="sorting"
        >
          <option value="desc">Popularity Descending</option>
          <option value="asc">Popularity Ascending</option>
        </select>
      </div>
    </div>

    <div class="mb-6">
      <div class="flex items-center mb-4">
        <i class="pi pi-filter text-blue-500 mr-2"></i>
        <h3 class="text-lg font-semibold text-gray-700">Filter</h3>
      </div>
      <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-600">Filter Results By</label>
        <select 
          v-model="filterValue" 
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-700"
          name="genre"
        >
          <option value="">All Genres</option>
          <option value="28">Action</option>
          <option value="12">Adventure</option>
          <option value="16">Animation</option>
          <option value="35">Comedy</option>
          <option value="80">Crime</option>
          <option value="99">Documentary</option>
          <option value="18">Drama</option>
          <option value="10751">Family</option>
          <option value="14">Fantasy</option>
          <option value="36">History</option>
          <option value="27">Horror</option>
          <option value="10402">Music</option>
          <option value="9648">Mystery</option>
          <option value="10749">Romance</option>
          <option value="878">Science Fiction</option>
          <option value="10770">TV Movie</option>
          <option value="53">Thriller</option>
          <option value="10752">War</option>
          <option value="37">Western</option>
        </select>
      </div>
    </div>

    <button 
      @click="() => { sortValue = ''; filterValue = ''; }"
      class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
    >
      <i class="pi pi-refresh mr-2"></i>
      Reset Filters
    </button>
  </div>
</template>

<style scoped>
.sidebar-container {
  height: fit-content;
  position: sticky;
  top: 2rem;
}

select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

@media (max-width: 768px) {
  .sidebar-container {
    position: static;
    max-width: none;
    margin-bottom: 2rem;
  }
}
</style>
