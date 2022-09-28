<template>
  <div>
    <div class="card">
      <!-- Toolbar Section -->
      <pv-toolbar class="mb-4">
        <template #start>
          <pv-button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew"></pv-button>
          <pv-button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected"
                     :disabled="!selectedDestinations || !selectedDestinations.length"></pv-button>
        </template>
        <template #end>
          <pv-button label="Export" icon="pi pi-download" class="p-button-help"
                     @click="exportToCSV($event)"></pv-button>
        </template>
      </pv-toolbar>

      <!-- Data Table Section -->
      <pv-data-table ref="dt" :value="destinations"
                     v-model:selection="selectedDestinations"
                     dataKey="id"
                     :paginator="true"
                     :rows="10"
                     :filters="filters"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                     :rowsPerPageOptions="[5, 10, 25]"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} destinations"
                     responsiveLayout="scroll">

        <template #header>

          <div class="table-header flex flex-column md:flex-row md:justify-content-between">
            <h5 class="mb-2 md:m-0 p-as-md-center text-xl">Manage Destinations</h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <pv-input-text v-model="filters['global'].value" placeholder="Search..."></pv-input-text>
            </span>
          </div>
        </template>

        <pv-column selectionMode="multiple" style="width: 3rem" :exportable="false"></pv-column>
        <pv-column field="id" header="Id" :sortable="true" style="min-width: 12rem"></pv-column>
        <pv-column field="name" header="Name" :sortable="true" style="min-width: 16rem"></pv-column>


        <pv-column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <pv-button icon="pi pi-pencil" class="p-button-text p-button-rounded"
                       @click="editDestiny(slotProps.data)"></pv-button>
            <pv-button icon="pi pi-trash" class="p-button-text p-button-rounded"
                       @click="confirmDeleteDestiny(slotProps.data)"></pv-button>
          </template>
        </pv-column>

      </pv-data-table>

      <!-- Add/Edit Destiny Dialog -->
      <pv-dialog
          v-model:visible="destinyDialog"
          :style="{ width: '450px'}"
          header="Destiny Information"
          :modal="true"
          class="p-fluid">
        <div class="field mt-3">
          <span class="p-float-label">
            <pv-input-text type="text"
                           v-model.trim="destiny.name"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !destiny.name}"/>
            <label for="name">Name</label>
            <small class="p-error" v-if="submitted && !destiny.name">
              Name is required
            </small>
          </span>
        </div>

        <template #footer>
          <pv-button :label="'Cancel'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
          <pv-button :label="'Save'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="saveDestiny"/>
        </template>

      </pv-dialog>


      <!-- Delete Destiny Confirmation Dialog -->
      <pv-dialog v-model:visible="deleteDestinyDialog" :style="{width: '450px'}"
                 header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
          <span v-if="destiny">
            Are you sure you want to delete <b>{{ destiny.name }}</b>?
          </span>
        </div>
        <template #footer>
          <pv-button :label="'No'.toUpperCase()"
                     icon="pi pi-times"
                     class="p-button-text"
                     @click="deleteDestinyDialog = false"/>
          <pv-button :label="'Yes'.toUpperCase()"
                     icon="pi pi-check"
                     class="p-button-text"
                     @click="deleteDestiny"/>
        </template>
      </pv-dialog>


      <!-- Delete Selected Destinations Confirmation Dialog -->
      <pv-dialog
          v-model:visible="deleteDestinationsDialog"
          :style="{ width: '450px'}"
          header="Confirm"
          :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3"
             style="font-size: 2rem"/>
          <span v-if="selectedDestinations">Are you sure you want to delete the selected destinations?</span>
        </div>
        <template #footer>
          <pv-button :label="'No'.toUpperCase()"
                     icon="pi pi-times"
                     class="p-button-text"
                     @click="deleteDestinationsDialog = false"/>
          <pv-button :label="'Yes'.toUpperCase()"
                     icon="pi pi-check"
                     class="p-button-text"
                     @click="deleteSelectedDestinations"/>
        </template>
      </pv-dialog>

    </div>
  </div>
</template>

<script>
import {FilterMatchMode} from "primevue/api";
import {DestinationsApiService} from "@/varuta/services/destinations-api.service";

export default {
  name: "destiny-list.component",
  data() {
    return {
      destinations: [],
      destinyDialog: false,
      deleteDestinyDialog: false,
      deleteDestinationsDialog: false,
      destiny: {},
      selectedDestinations: null,
      filters: {},
      submitted: false,
      destinationsService: null
    };
  },
  created() {
    this.destinationsService = new DestinationsApiService();
    this.destinationsService.getAll().then((response) => {
      this.destinations = response.data;
      console.log(this.destinations);
      this.destinations.forEach((destiny) => this.getDisplayableDestiny(destiny));
      console.log(this.destinations);
    });
    this.initFilters();
  },

  methods: {

    getDisplayableDestiny(destiny) {
      return destiny;
    },

    getStorableDestiny(displayableDestiny) {
      return {
        id: displayableDestiny.id,
        name: displayableDestiny.name
      };
    },

    openNew() {
      this.destiny = {};
      this.submitted = false;
      this.destinyDialog = true;
    },

    hideDialog() {
      this.destinyDialog = false;
      this.submitted = false;
    },

    findIndexById(id) {
      console.log(`current id: ${id}`);
      return this.destinations.findIndex((destiny) => destiny.id === id);
    },

    saveDestiny() {
      this.submitted = true;
      if (this.destiny.name.trim()) {
        if (this.destiny.id) {
          console.log(this.destiny);
          this.destiny = this.getStorableDestiny(this.destiny);
          this.destinationsService.update(this.destiny.id, this.destiny)
              .then((response) => {
                console.log(response.data.id);
                this.destinations[this.findIndexById(response.data.id)] =
                    this.getDisplayableDestiny(response.data);
                this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Destiny Updated', life: 3000});
                console.log(response);
              });
        } else {
          this.destiny.id = 0;
          console.log(this.destiny);
          this.destiny = this.getStorableDestiny(this.destiny);
          this.destinationsService.create(this.destiny).then((response) => {
            this.destiny = this.getDisplayableDestiny(response.data);
            this.destinations.push(this.destiny);
            this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Destiny Created', life: 3000});
            console.log(response);
          });
        }
        this.destinyDialog = false;
        this.destiny = {};
      }
    },

    editDestiny(destiny) {
      console.log(destiny);
      this.destiny = {...destiny};
      console.log(this.destiny);
      this.destinyDialog = true;
    },

    confirmDeleteDestiny(destiny) {
      this.destiny = destiny;
      this.deleteDestinyDialog = true;
    },

    deleteDestiny() {
      this.destinationsService.delete(this.destiny.id).then((response) => {
        this.destinations = this.destinations.filter((t) => t.id !== this.destiny.id);
        this.deleteDestinyDialog = false;
        this.destiny = {};
        this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Destiny Deleted', life: 3000});
        console.log(response);
      });
    },

    exportToCSV() {
      this.$refs.dt.exportCSV();
    },

    confirmDeleteSelected() {
      this.deleteDestinationsDialog = true;
    },

    deleteSelectedDestinations() {
      this.selectedDestinations.forEach((destiny) => {
        this.destinationsService.delete(destiny.id).then((response) => {
          this.destinations = this.destinations.filter((t) => t.id !== this.destiny.id);
          console.log(response);
        });
      });
      this.deleteDestinationsDialog = false;
    },

    initFilters() {
      this.filters = {global: {value: null, matchMode: FilterMatchMode.CONTAINS}};
    }

  }
}
</script>

<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
