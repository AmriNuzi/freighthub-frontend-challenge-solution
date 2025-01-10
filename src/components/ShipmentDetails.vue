<template>
  <v-container>
    <v-toolbar dark color="#2e76bc">
      <v-toolbar-title>Details</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card class="mt-4">
      <v-card-title>Ngarkesa: {{ shipment.name }}</v-card-title>
      <v-card-text>
        <p><strong>ID:</strong> {{ shipment.id }}</p>
        <p><strong>Origjina:</strong> {{ shipment.origin }}</p>
        <p><strong>Destinacioni:</strong> {{ shipment.destination }}</p>
        <p><strong>Statusi:</strong> {{ shipment.status }}</p>
        <p><strong>Ngarkesa:</strong></p>
        <ul>
          <li v-for="(cargo, index) in shipment.cargo" :key="index">
            {{ cargo.type }}: {{ cargo.description }} (Vellimi:
            {{ cargo.volume }})
          </li>
        </ul>
      </v-card-text>
      <v-btn @click="goBack">Go Back</v-btn>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      shipment: {},
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: "shipment-list" });
    },
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const response = await axios.get(`http://localhost:3000/shipments/${id}`);
      this.shipment = response.data;
    } catch (error) {
      console.error("Gabim gjatë marrjes së të dhënave për ngarkesën:", error);
    }
  },
};
</script>

<style scoped></style>
