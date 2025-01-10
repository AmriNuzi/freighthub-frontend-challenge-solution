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

    <v-dialog v-model="deleteDialog" max-width="500px" height="300px">
      <v-card>
        <v-card-title class="headline">Deshironi te vazdoni</v-card-title>
        <v-card-actions>
          <v-btn text @click="deleteDialog = false">Anulo</v-btn>
          <v-btn color="red darken-1" @click="deleteItemConfirm(item.id)"
            >Fshi</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

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
          <span class="headline">Edit</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editedShipment.name"
            label="Emri i Ngarkesës"
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
import axios from "axios";

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
      deleteDialog: false,
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

      return this.shipments.filter((shipment) => {
        return (
          (shipment.id &&
            shipment.id.toString().toLowerCase().includes(searchTerm)) ||
          (shipment.name && shipment.name.toLowerCase().includes(searchTerm)) ||
          (shipment.cargo &&
            shipment.cargo.some((cargo) =>
              `${cargo.type} ${cargo.description} ${cargo.volume}`
                .toLowerCase()
                .includes(searchTerm)
            )) ||
          (shipment.type && shipment.type.toLowerCase().includes(searchTerm)) ||
          (shipment.destination &&
            shipment.destination.toLowerCase().includes(searchTerm)) ||
          (shipment.origin &&
            shipment.origin.toLowerCase().includes(searchTerm)) ||
          (shipment.status &&
            shipment.status.toLowerCase().includes(searchTerm))
        );
      });
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
      try {
        const response = await axios.get("http://localhost:3000/shipments");
        this.shipments = response.data;
      } catch (error) {
        console.error("error ne get", error);
      }
    },
    async viewItem(id) {
      try {
        const response = await axios.get(
          `http://localhost:3000/shipments/${id}`
        );
        console.log("res get", response.data);
        this.$router.push({ name: "shipment-details", params: { id } });
      } catch (error) {
        console.error("error", error);
      }
    },

    confirmDelete(id) {
      this.itemToDelete = id;
      this.deleteDialog = true;
    },

    async deleteItemConfirm() {
      if (this.itemToDelete) {
        try {
          await axios.delete(
            `http://localhost:3000/shipments/${this.itemToDelete}`
          );
          this.getData();
          this.deleteDialog = false;
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      }
    },
    editItem(item) {
      this.editedShipment = { ...item }; 
      this.editDialog = true; 
    },
    async saveEdit() {
      try {
        await axios.put(
          `http://localhost:3000/shipments/${this.editedShipment.id}`,
          this.editedShipment
        );
        this.getData(); 
        this.editDialog = false; 
      } catch (error) {
        console.error("error", error);
      }
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
