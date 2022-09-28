<template>
  <div>
    <div class="card">
      <!-- Toolbar Section -->
      <pv-toolbar class="mb-4">
        <template #start>
          <pv-button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew"></pv-button>
          <pv-button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected"
                     :disabled="!selectedSenders || !selectedSenders.length"></pv-button>
        </template>
        <template #end>
          <pv-button label="Export" icon="pi pi-download" class="p-button-help"
                     @click="exportToCSV($event)"></pv-button>
        </template>
      </pv-toolbar>

      <!-- Data Table Section -->
      <pv-data-table ref="dt" :value="senders"
                     v-model:selection="selectedSenders"
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
            <h5 class="mb-2 md:m-0 p-as-md-center text-xl">Manage Senders</h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <pv-input-text v-model="filters['global'].value" placeholder="Search..."></pv-input-text>
            </span>
          </div>
        </template>

        <pv-column selectionMode="multiple" style="width: 3rem" :exportable="false"></pv-column>
        <pv-column field="id" header="Id" :sortable="true" style="min-width: 12rem"></pv-column>
        <pv-column field="name" header="Name" :sortable="true" style="min-width: 16rem"></pv-column>
        <pv-column field="dni" header="DNI" :sortable="true" style="min-width: 16rem"></pv-column>
        <pv-column field="phone" header="Phone" :sortable="true" style="min-width: 16rem"></pv-column>


        <pv-column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <pv-button icon="pi pi-pencil" class="p-button-text p-button-rounded"
                       @click="editSender(slotProps.data)"></pv-button>
            <pv-button icon="pi pi-trash" class="p-button-text p-button-rounded"
                       @click="confirmDeleteSender(slotProps.data)"></pv-button>
          </template>
        </pv-column>

      </pv-data-table>

      <!-- Add/Edit Sender Dialog -->
      <pv-dialog
          v-model:visible="senderDialog"
          :style="{ width: '450px', height: '400px'}"
          header="Sender Information"
          :modal="true"
          class="p-fluid">
        <div class="field mt-3">
          <span class="p-float-label">
            <pv-input-text type="text"
                           v-model.trim="sender.name"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !sender.name}"/>
            <label for="name">Name</label>
            <pv-input-text type="text"
                           v-model.trim="sender.dni"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !sender.dni}"/>
            <label for="name">DNI</label>
            <pv-input-text type="text"
                           v-model.trim="sender.phone"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !sender.phone}"/>
            <label for="name">Phone</label>
            <small class="p-error" v-if="submitted && (!sender.name || !sender.dni || !sender.phone)">
              Required entry field
            </small>
          </span>
        </div>
        <template #footer>
          <pv-button :label="'Cancel'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
          <pv-button :label="'Save'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="saveSender"/>
        </template>

      </pv-dialog>


      <!-- Delete Sender Confirmation Dialog -->
      <pv-dialog v-model:visible="deleteSenderDialog" :style="{width: '450px'}"
                 header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
          <span v-if="sender">
            Are you sure you want to delete <b>{{ sender.name }}</b>?
          </span>
        </div>
        <template #footer>
          <pv-button :label="'No'.toUpperCase()"
                     icon="pi pi-times"
                     class="p-button-text"
                     @click="deleteSenderDialog = false"/>
          <pv-button :label="'Yes'.toUpperCase()"
                     icon="pi pi-check"
                     class="p-button-text"
                     @click="deleteSender"/>
        </template>
      </pv-dialog>


      <!-- Delete Selected Senders Confirmation Dialog -->
      <pv-dialog
          v-model:visible="deleteSendersDialog"
          :style="{ width: '450px'}"
          header="Confirm"
          :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3"
             style="font-size: 2rem"/>
          <span v-if="selectedSenders">Are you sure you want to delete the selected senders?</span>
        </div>
        <template #footer>
          <pv-button :label="'No'.toUpperCase()"
                     icon="pi pi-times"
                     class="p-button-text"
                     @click="deleteSendersDialog = false"/>
          <pv-button :label="'Yes'.toUpperCase()"
                     icon="pi pi-check"
                     class="p-button-text"
                     @click="deleteSelectedSenders"/>
        </template>
      </pv-dialog>

    </div>
  </div>
</template>

<script>
import {FilterMatchMode} from "primevue/api";
import {SendersApiService} from "@/varuta/services/senders-api.service";

export default {
  name: "sender-list.component",
  data() {
    return {
      senders: [],
      senderDialog: false,
      deleteSenderDialog: false,
      deleteSendersDialog: false,
      sender: {},
      selectedSenders: null,
      filters: {},
      submitted: false,
      sendersService: null
    };
  },
  created() {
    this.sendersService = new SendersApiService();
    this.sendersService.getAll().then((response) => {
      this.senders = response.data;
      console.log(this.senders);
      this.senders.forEach((sender) => this.getDisplayableSender(sender));
      console.log(this.senders);
    });
    this.initFilters();
  },

  methods: {

    getDisplayableSender(sender) {
      return sender;
    },

    getStorableSender(displayableSender) {
      return {
        id: displayableSender.id,
        name: displayableSender.name,
        dni: displayableSender.dni,
        phone: displayableSender.phone
      };
    },

    openNew() {
      this.sender = {};
      this.submitted = false;
      this.senderDialog = true;
    },

    hideDialog() {
      this.senderDialog = false;
      this.submitted = false;
    },

    findIndexById(id) {
      console.log(`current id: ${id}`);
      return this.senders.findIndex((sender) => sender.id === id);
    },

    saveSender() {
      this.submitted = true;
      if (this.sender.name.trim() && this.sender.dni.trim() && this.sender.phone.trim()) {
        if (this.sender.id) {
              console.log(this.sender);
              this.sender = this.getStorableSender(this.sender);
              this.sendersService.update(this.sender.id, this.sender)
                  .then((response) => {
                    console.log(response.data.id);
                    this.senders[this.findIndexById(response.data.id)] =
                        this.getDisplayableSender(response.data);
                    this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Sender Updated', life: 3000});
                    console.log(response);
                  });
            } else {
              this.sender.id = 0;
              console.log(this.sender);
              this.sender = this.getStorableSender(this.sender);
              this.sendersService.create(this.sender).then((response) => {
                this.sender = this.getDisplayableSender(response.data);
                this.senders.push(this.sender);
                this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Sender Created', life: 3000});
                console.log(response);
              });

            }


        this.senderDialog = false;
        this.sender = {};
      }
    },

    editSender(sender) {
      console.log(sender);
      this.sender = {...sender};
      console.log(this.sender);
      this.senderDialog = true;
    },

    confirmDeleteSender(sender) {
      this.sender = sender;
      this.deleteSenderDialog = true;
    },

    deleteSender() {
      this.sendersService.delete(this.sender.id).then((response) => {
        this.senders = this.senders.filter((t) => t.id !== this.sender.id);
        this.deleteSenderDialog = false;
        this.sender = {};
        this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Sender Deleted', life: 3000});
        console.log(response);
      });
    },

    exportToCSV() {
      this.$refs.dt.exportCSV();
    },

    confirmDeleteSelected() {
      this.deleteSendersDialog = true;
    },

    deleteSelectedSenders() {
      this.selectedSenders.forEach((sender) => {
        this.sendersService.delete(sender.id).then((response) => {
          this.senders = this.senders.filter((t) => t.id !== this.sender.id);
          console.log(response);
        });
      });
      this.deleteSendersDialog = false;
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

