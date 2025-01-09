<template>
  <v-container>
    <v-toolbar dark color="#2e76bc">
      <v-toolbar-title>Shipments</v-toolbar-title>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="shipmentDetails"
      item-key="id"
      dense
      hide-default-footer
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.destination }}</td>
          <td>{{ item.origin }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </template>
    </v-data-table>
    <br />

    <v-btn @click="goBack()">Go Back</v-btn>
  </v-container>
</template>

<script>
import shipmentsData from "../assets/db.json";

export default {
  props: ["id"],
  data() {
    return {
      shipment: null,
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Destination", value: "destination" },
        { text: "Origin", value: "origin" },
        { text: "Type", value: "type" },
        { text: "Status", value: "status" },
      ],
      shipmentDetails: [],
    };
  },
  created() {
    this.loadShipmentDetails();
  },
  methods: {
    loadShipmentDetails() {
      this.shipment = shipmentsData.find((item) => item.id === this.id);

      if (this.shipment) {
        this.shipmentDetails = [this.shipment];
      }
    },
    goBack() {
      this.$router.push({ name: "shipment-list" });
    },
  },
};
</script>
