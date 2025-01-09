<template>
  <v-app>
    <!-- <v-app-bar app dark color="primary">
      <v-toolbar-title>Management</v-toolbar-title>
    </v-app-bar> -->

    <v-navigation-drawer app>
      <v-list dense>
        <v-list-item to="/shipment-list" router>
          <v-list-item-title>Shipments</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.app {
  width: 100%;
}
/* Optional custom styles */
</style>
