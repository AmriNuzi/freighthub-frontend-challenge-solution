<template>
  <v-container fluid>
    <v-toolbar dark color="#2e76bc">
      <v-toolbar-title>Ngarkesat</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Kerko"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar-items>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="paginatedData"
      :items-per-page="itemsPerPage"
      v-model:page="currentPage"
      class="elevation-1"
      hide-default-footer
      dense
      :sort-by="sortBy"
      :sort-desc="sortDesc"
    >
      <template v-slot:[`item.cargo`]="{ item }">
        <ul>
          <li v-for="(cargo, index) in item.cargo" :key="index">
            {{ cargo.type }}: {{ cargo.description }} (Vellimi:
            {{ cargo.volume }})
          </li>
        </ul>
      </template>

      <template v-slot:[`item.services`]="{ item }">
        <ul>
          <li v-for="(service, index) in item.services" :key="index">
            {{ service.type
            }}<span v-if="service.value"> (Vlera: {{ service.value }})</span>
          </li>
        </ul>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <div class="action-buttons">
          <v-icon class="mr-2" @click="viewItem(item.id)" color="blue" small>
            more_vert
          </v-icon>
          <v-icon @click="editItem(item)" color="green" small> edit </v-icon>
          <v-icon @click="confirmDelete(item.id)" color="red" small>
            delete
          </v-icon>
        </div>
      </template>
    </v-data-table>

    <v-toolbar flat class="fixed-pagination">
      <v-spacer></v-spacer>
      <v-pagination
        :length="Math.ceil(filteredShipments.length / itemsPerPage)"
        prev-icon="<"
        next-icon=">"
        v-model="currentPage"
      ></v-pagination>
    </v-toolbar>

    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"> edit</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editedShipment.name"
            label="Emri i Ngarkeses"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="editDialog = false">Anulo</v-btn>
          <v-btn color="blue darken-1" @click="saveEdit">Ruaj</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import shipmentsData from "@/assets/db.json";

export default {
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      search: "",
      shipments: [],
      sortBy: "id",
      sortDesc: false,
      editDialog: false,
      editedShipment: {},
      headers: [
        { text: "ID", value: "id" },
        { text: "Emri", value: "name" },
        { text: "Ngarkesa", value: "cargo" },
        { text: "Menyra", value: "mode" },
        { text: "Lloji", value: "type" },
        { text: "Destinacioni", value: "destination" },
        { text: "Origjina", value: "origin" },
        { text: "Sherbime", value: "services" },
        { text: "Totali", value: "total" },
        { text: "Statusi", value: "status" },
        { text: "Aksionet", value: "actions", sortable: false },
      ],
    };
  },

  computed: {
    filteredShipments() {
      const searchTerm = this.search.toLowerCase();
      return this.shipments.filter(
        (shipment) =>
          shipment.id.toLowerCase().includes(searchTerm) ||
          shipment.name.toLowerCase().includes(searchTerm)
      );
    },
    paginatedData() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredShipments.slice(startIndex, endIndex).sort((a, b) => {
        const order = this.sortDesc ? -1 : 1;
        return a[this.sortBy] > b[this.sortBy] ? order : -order;
      });
    },
  },

  methods: {
    async getData() {
      const storedShipments = localStorage.getItem("shipments");
      if (storedShipments) {
        this.shipments = JSON.parse(storedShipments);
      } else {
        this.shipments = shipmentsData;
        localStorage.setItem("shipments", JSON.stringify(this.shipments));
      }
    },
    viewItem(id) {
      this.$router.push({ name: "shipment-details", params: { id } });
    },
    confirmDelete(id) {
      const confirmed = confirm("A deshironi te vazhdoni?");
      if (confirmed) {
        this.deleteItem(id);
      }
    },
    deleteItem(id) {
      this.shipments = this.shipments.filter((shipment) => shipment.id !== id);
      this.saveShipments();
    },
    editItem(item) {
      this.editedShipment = { ...item };
      this.editDialog = true;
    },
    saveEdit() {
      const index = this.shipments.findIndex(
        (shipment) => shipment.id === this.editedShipment.id
      );
      if (index !== -1) {
        this.shipments[index] = { ...this.editedShipment };
        console.log("Edited Shipment:", this.editedShipment);
        this.saveShipments();
        this.editDialog = false;
      }
    },
    saveShipments() {
      localStorage.setItem("shipments", JSON.stringify(this.shipments));
      this.getData();
    },
  },

  created() {
    this.getData();
  },
};
</script>

<style scoped>
.fixed-pagination {
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: transparent;
  color: none;
}
.action-buttons {
  display: flex;
  gap: 8px;
}
</style>
