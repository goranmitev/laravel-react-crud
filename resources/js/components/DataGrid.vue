




<template>
    <main class="col" role="main" id="main">
        <div v-if="table">
            <div class="heading">

                <slot name="header"></slot>

                <div class="float-right mr-3">
                    <button  style="color: #2483B3;" type="button" class="btn btn-secondary my-2 my-sm-0" @click="showFilters()">
                        <i class="fa fa-filter" style="color: #2483B3;"></i>
                        Filter
                    </button>
                </div>
                <div class="clearfix"></div>
            </div>

            <slot name="flash"></slot>

            <div class="table-responsive">
                <table class="table-admin">
                    <thead>
                        <tr>
                            <th v-for="(th, index) in table.columns" :key="index">
                                <a href="#" v-if="th.sortable" @click.prevent="onSort(index)">
                                    {{ th.label }}
                                    <i class="fa fa-sort-down" v-if="sorting.direction=='asc' && sorting.sort==index"></i>
                                    <i class="fa fa-sort-up" v-else-if="sorting.direction=='desc' && sorting.sort==index"></i>
                                    <i class="fa fa-sort" v-else></i>
                                </a>
                                <span v-else>{{ th.label }}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filtering">
                            <td v-for="(column, index) in table.columns" :key="index">
                                <input type="text" class="form-control" v-if="column.filterable && column.filter=='text'" @keyup="onFilter(column, index, $event.target.value)">
                                <select class="form-control" v-if="column.filterable && column.filter=='select'" @change="onFilter(column, index, $event.target.value)">
                                    <option value="">Please select</option>
                                    <option v-for="(option, value) in column.filterOptions" :value="value" :key="value">{{ option }}</option>
                                </select>
                            </td>
                        </tr>
                        <tr v-for="(row, rowIndex) in table.records.data" :key="rowIndex">
                            <td v-for="(column, columnIndex) in table.columns" :key="columnIndex">
                                <component v-if="column.type" v-bind:is="column.type" v-bind:options="getOptions(row, column, columnIndex)"></component>
                                <template v-else>{{ getItem(row, columnIndex) }}</template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="row">
                <div class="col">
                    <div class="paginator-summary">
                        Showing {{ table.records.from }} - {{ table.records.to }} out of {{ table.records.total }}
                    </div>
                </div>

                <div class="col">
                    <ul class="pagination float-right">
                        <li class="page-item" v-if="table.records.prev_page_url">
                            <a href="#" class="page-link" @click.prevent="loadPage(table.records.prev_page_url)">
                                <img src="/images/arrow-left.svg">
                            </a>
                        </li>

                        <li v-for="page in pageRange" :key="page.pageNumber" class="page-item"
                            :class="{'active': page.pageNumber == table.records.current_page }">
                            <a href="#" class="page-link" @click.prevent="loadPage(table.records.path + '?page=' + page.pageNumber)">
                                <span>{{ page.pageNumber }}</span>
                            </a>
                        </li>

                        <li class="page-item" v-if="table.records.next_page_url">
                            <a href="#" class="page-link" @click.prevent="loadPage(table.records.next_page_url)">
                                <img src="/images/arrow-right.svg">
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </main>
</template>

<script>

import Link from "./components/Link";
import Badge from "./components/Badge";
import Actions from "./components/Actions";
import Html from "./components/Html";

export default {
    props: {
        base: null
    },
    components:{
        Link,
        Badge,
        Actions,
        Html
    },
    data() {
        return {
            baseUrl: '/api/'+this.base+'/data',
            table: null,
            filtering: false,
            filters: {}, // Object
            sorting: {}, // Object,
            strictFilters: {},
            timer: null
        };
    },
    methods: {
        fetchData() {
            this.$root.showLoading = true;
            let self = this;

            axios.get(this.url)
                .then((response) => {
                    self.table = response.data;
                    self.$root.showLoading = false;
                })
                .catch((error) => {
                    self.$root.showLoading = false;
                    console.log(error);
                });
        },
        showFilters() {
            this.filtering = !this.filtering;
            if (this.filtering === false) {
                this.filters = {};
            }
        },
        onSort(index) {
            this.sorting.sort = index;
            if(this.sorting.direction === 'asc') {
                this.sorting.direction = 'desc';
            } else {
                this.sorting.direction = 'asc';
            }

            this.url = this.baseUrl + this.getQueryString();
            this.fetchData();
        },
        onFilter(column, field, value) {

            if (value === '') {
                if (column.filterBy){
                    delete this.filters[column.filterBy];
                } else {
                    delete this.filters[field];
                }
            } else {
                if (column.filterBy){
                    this.filters[column.filterBy] = value;
                    this.strictFilters[column.filterBy] = column.filterStrict ? column.filterStrict : false;
                } else {
                    this.filters[field] = value;
                    this.strictFilters[field] = column.filterStrict ? column.filterStrict : false;
                }
            }

            let self = this;

            clearTimeout(this.timer);

            this.timer = setTimeout(function() {

                self.url = self.baseUrl + self.getQueryString();

                self.fetchData();
            }, 400);

        },
        getQueryStringSortingAndFiltering() {
            let queryString = '';

            if (this.sorting.sort) { // Recheck this condition
                queryString = '&sort='+this.sorting.sort+'&direction='+this.sorting.direction;
            }

            for (let field in this.filters) {
                queryString += '&filter['+field+']='+this.filters[field];
            }

            for (let field in this.strictFilters) {
                queryString += '&filterStrict['+field+']='+this.strictFilters[field];
            }

            return queryString;
        },
        getQueryString() {

            let queryString = '';

            if (this.table.records.current_page > 1) {
                queryString += '?page='+this.table.records.current_page;
            } else {
                queryString += '?page=1';
            }

            queryString += this.getQueryStringSortingAndFiltering();

            return queryString;
        },
        getItem(row, index) {
            return _.get(row, index, null);
        },
        loadPage(url) {
            this.url = url + this.getQueryStringSortingAndFiltering();
            this.fetchData();
        },
        getOptions(row, column, index) {

            switch (column.type) {
                case 'Actions':
                    return row.actions;

                case 'Html':
                    return this.getItem(row, index);

                case 'Link':
                    return {
                        url: '/'+this.base+'/'+row.id+'/edit',
                        label: this.getItem(row, index)
                    };

                case 'Badge':
                    let item = this.getItem(row, index);
                    return item !== null ? {
                        badge: item.badge,
                        label: item.label,
                        popover: item.popover ? item.popover : null
                    } : item;

                case 'Nav':
                    return {
                        class: 'drop-down-client-plans'
                    };
                default:
                    return;

            }
            return;
        }
    },
    computed: {
        pageRange: function() {
            let range = [];
            let number_of_pages = this.table.records.last_page;
            let current_page = this.table.records.current_page;
            let number_of_links = 10;
            let lower_limit = 1;
            let upper_limit = number_of_links;

            if (number_of_pages <= number_of_links) {
                lower_limit = 1;
                upper_limit = number_of_pages;
            } else {
                if (current_page > (number_of_links / 2 )) {
                    lower_limit = current_page - (number_of_links / 2 );
                    upper_limit = current_page + (number_of_links / 2 );
                    if (upper_limit > number_of_pages) {
                        upper_limit = number_of_pages;
                        lower_limit = upper_limit - number_of_links;
                    }
                } else {
                    lower_limit = 1;
                    upper_limit = number_of_links;
                }
            }

            for (let i = lower_limit; i <= upper_limit; i++ ){
                range.push({
                    pageNumber: i
                });
            }

            return range.length > 1 ? range : [];
        }
    },
    created() {
        this.url = this.baseUrl + '?page=1';
        this.fetchData();
    }
};
</script>

<style scoped>
.fa-filter {
    color: black;
}
</style>
