import Vue from "vue";
import Router from "vue-router";
// import ShipmentDetails from "@/views/ShipmentDetails.vue";
import ShipmentDetails from "@/components/ShipmentDetails.vue";
import ShipmentList from "@/components/ShipmentList.vue";

Vue.use(Router);

const routes = [
  {
    path: "/shipment-list",
    name: "shipment-list",
    component: ShipmentList,
  },
  {
    path: "/shipment-details/:id",
    name: "shipment-details",
    component: ShipmentDetails,
    props: true,
  },
];

const router = new Router({
  mode: "history",
  routes,
});

export default router;
