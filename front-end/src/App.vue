<script>
import Navbar from './components/Navbar.vue'
import AdminHeader from './components/admin/AdminHeader.vue';
import AdminSidebar from './components/admin/AdminSidebar.vue';


export default {
  name: 'App',
  computed: {
    headerComponent() {
      return this.$route.path.includes('/admin') ? AdminHeader : Navbar
    },
    footerComponent() {
      return this.$route.path.includes('/admin') ? AdminFooter : Footer

    },
    sidebarComponent() {
      return this.$route.path.includes('/admin') ? AdminSidebar : Sidebar
    }
  }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <!-- <Navbar/> -->
      <component :is="headerComponent" />
    </div>
  </header>

  <main class="main">
    <RouterView />
  </main>
  <!-- <Footer /> -->
</template>

<style scoped>
</style>
