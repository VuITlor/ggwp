<template>
  <nav class="sb-topnav navbar navbar-expand navbar-dark bg-info">
    <!-- Navbar Brand-->
    <a class="navbar-brand ps-3" href="/san-pham">Admin</a>
    <!-- Sidebar Toggle-->
    <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><font-awesome-icon :icon="['fas', 'bars']" /></button>
    <!-- Navbar Search-->
    <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
      <div class="input-group">
        <input class="form-control" type="text" placeholder="Search for..." aria-label="Search for..."
          aria-describedby="btnNavbarSearch" />
        <button class="btn btn-primary" id="btnNavbarSearch" type="button"><font-awesome-icon :icon="['fas', 'magnifying-glass']" /></button>
      </div>
    </form>
    <!-- Navbar-->
    <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
          aria-expanded="false"><font-awesome-icon :icon="['fas', 'user']" /></a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
          <li><a class="dropdown-item" href="#!">Settings</a></li>
          <li><a class="dropdown-item" href="#!">Activity Log</a></li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li><a class="dropdown-item" href="#!">Đăng xuất</a></li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup></script>

<style scoped>
.navbar {
  position: fixed;
  width: 100%;
  /* z-index: 1000; */
}
</style>
