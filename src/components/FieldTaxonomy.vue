<template>
  <div
    :class="`taxonomy-field ${asSelect ? 'taxonomy-field--as-select' : ''} ${
      open ? 'taxonomy-field--opened' : 'taxonomy-field--closed'
    }`"
    v-if="terms !== undefined"
    v-click-outside="hide"
  >
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <div class="taxonomy-field__container">
      <div
        class="taxonomy-field__placeholder"
        v-show="asSelect && selectedTermsLength < 1"
        @click="toggleOpenIfAsSelect"
      >
        <span>{{ placeholder }}</span>
        <Icon type="arrowDown" color="inherit"></Icon>
      </div>
      <TaxonomyList
        v-if="selectedTermsLength > 0"
        :taxonomy="taxonomy"
        :selected-terms="theValue"
        :cliquable="true"
        tagType="main"
        @tagClick="removeTerm"
        icon="close"
        class="taxonomy-field__selected-terms"
        :class="{ 'taxonomy-field__selected-terms--open': open }"
        @click.native="toggleOpenIfAsSelect"
      ></TaxonomyList>
      <div
        class="taxonomy-field__choices"
        v-show="
          (asSelect && open) ||
          (!asSelect && open) ||
          (!asSelect && selectedTermsLength == 0)
        "
        :class="{ 'taxonomy-field__choices--max': max <= selectedTermsLength }"
      >
        <div v-if="hasSearch" class="taxonomy-field__search">
          <input
            type="search"
            class="taxonomy-field__search-input"
            placeholder="Chercher une catégorie..."
            v-model="searchTaxo"
          />
        </div>
        <div
          v-for="term in alphabeticallySortedTerms"
          :key="term._id"
          class="taxonomy-field__term"
          :class="{ selected: isSelected(term._id) }"
        >
          <label
            :for="term._id + '-checkbox'"
            class="taxonomy-field__term-label"
          >
            <span class="term-title">{{ term.name.fr }}</span>
            <input
              v-model="theValue"
              :value="term"
              @blur="$emit('blur')"
              @change="$emit('change')"
              type="checkbox"
              v-show="!(selectedTermsLength >= max && !isSelected(term._id))"
              :disabled="selectedTermsLength >= max && !isSelected(term._id)"
              :id="term._id + '-checkbox'"
            />
          </label>
        </div>
      </div>
      <div
        class="taxonomy-field__edit"
        v-on:click="onOpen"
        v-show="!open && !asSelect"
      >
        Modifier
      </div>
    </div>
    <p class="taxonomy-field__description" v-show="open && !asSelect">
      <span v-if="selectedTermsLength == 0"
        >Sélectionne {{ max }} {{ termTypeLabel }} dans la liste.</span
      >
      <span v-else-if="max > selectedTermsLength"
        >Il te reste {{ max - selectedTermsLength }} {{ termTypeLabel }} à
        choisir.</span
      >
      <span v-else>Tu as atteint le nombre maximum de choix.</span>
    </p>
  </div>
  <div v-else>
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <div class="loading">Chargement...</div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import { mapGetters, mapActions } from "vuex";
import FieldLabel from "../../atoms/field/fieldLabel";
import TaxonomyList from "./taxonomyList";
import Icon from "../../atoms/icon/icon";

export default {
  name: "FieldTaxonomy",
  components: { Icon, TaxonomyList, FieldLabel },
  props: {
    value: {
      required: true,
    },
    termTypeLabel: {
      required: false,
      type: String,
      default: "element(s)",
    },
    objectExport: {
      required: false,
      type: Boolean,
      default: false,
    },
    hasSearch: {
      required: false,
      type: Boolean,
      default: false,
    },
    max: {
      required: false,
      type: Number,
    },
    taxonomy: {
      required: true,
      type: String,
    },
    placeholder: {
      type: String,
      default: "Choisir une catégorie",
    },
    label: {
      type: String,
    },
    filterBy: {
      type: [String, Array],
      default: "alphabetically",
    },
    asSelect: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "dark", // or light
    },
  },
  directives: {
    ClickOutside,
  },
  data: function () {
    return {
      theValue: null,
      open: true,
      searchTaxo: null,
    };
  },
  created: function () {
    if (!this.value) this.theValue = [];
    else if (!Array.isArray(this.value)) this.theValue = [this.value];
    else this.theValue = this.value;

    if (this.theValue.length > 0 || this.asSelect) this.open = false;
  },
  watch: {
    theValue: function () {
      if (this.objectExport)
        if (this.theValue.length > 0)
          return this.$emit("input", this.theValue[0]);

      if (this.theValue.length === 0 && !this.asSelect) this.open = true;

      this.$emit("input", this.theValue);
    },
    value: function () {
      if (!this.value) this.theValue = [];
      else if (!Array.isArray(this.value)) this.theValue = [this.value];
      else this.theValue = this.value;
    },
  },
  computed: {
    ...mapGetters("taxonomies", [
      "getTaxonomies",
      "getTaxonomy",
      "getTaxonomiesSettings",
    ]),

    selectedTermsLength: function () {
      if (this.theValue === undefined || this.theValue.length === undefined)
        return 0;
      else return this.theValue.length;
    },

    selectedTermsIds: function () {
      return this.extractIds(this.theValue);
    },

    choices: function () {
      return this.extractIds(this.getTaxonomy(this.taxonomy).termsArray).filter(
        (el) => !this.selectedTermsIds.includes(el)
      );
    },

    terms() {
      return this.getTaxonomy(this.taxonomy).terms;
    },

    alphabeticallySortedTerms() {
      // next line deletes the lastSync property to make the selection work.
      // todo : refactor to compare with id only and not entire object
      Object.values(this.terms).forEach(function (t) {
        delete t.lastSync;
      });

      if (this.filterBy === "none") {
        return this.terms;
      }

      if (this.filterBy === "settings") {
        this.getTaxonomiesSettings[this.taxonomy];
        const filtered = this.getTaxonomy(this.taxonomy).termsArray.filter(
          (term) => {
            return this.getTaxonomiesSettings[this.taxonomy].includes(term._id);
          }
        );
        return filtered;
      }

      if (Array.isArray(this.filterBy) && this.filterBy.length > 0) {
        const filtered = this.getTaxonomy(this.taxonomy).termsArray.filter(
          (term) => {
            return this.filterBy.includes(term._id);
          }
        );
        return filtered;
      }

      // filter by search keyword
      if (this.hasSearch && !!this.searchTaxo) {
        return Object.values(this.terms).filter((term) => {
          return term.name.fr
            .toLowerCase()
            .includes(this.searchTaxo.toLowerCase());
        });
      }

      // default filterBy alphabetically
      return Object.values(this.terms).sort(function (a, b) {
        return a.name.fr.localeCompare(b.name.fr);
      });
    },
  },
  methods: {
    ...mapActions({}),

    isSelected(id) {
      for (var index in this.theValue) {
        if (this.theValue[index]._id === id) return true;
      }

      return false;
    },

    extractIds: function (data) {
      var thing = [];

      if (Array.isArray(data)) {
        for (var index in data) {
          if (data[index]._id !== undefined) thing.push(data[index]._id);
        }
      } else {
        if (data._id !== undefined) thing.push(data._id);
      }

      return thing;
    },

    onOpen: function () {
      if (this.open) this.open = false;

      this.open = true;
    },

    removeTerm: function (id) {
      for (var index in this.theValue) {
        if (this.theValue[index]._id === id) this.theValue.splice(index, 1);
      }
    },

    toggleOpenIfAsSelect() {
      if (this.asSelect) {
        this.open = !this.open;
      }
    },

    hide() {
      if (this.asSelect) {
        this.open = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.taxonomy-field {
  text-align: left;
}
.taxonomy-field--as-select {
  .FieldLabel {
    color: white;
  }
}
.taxonomy-field__container {
  position: relative;
  border: 1px solid gray;
  border-radius: 10px;
  background: #eee;
  overflow: hidden;
  text-align: left;
  color: darkblue;

  .taxonomy-field--as-select & {
    overflow: visible;
  }
}

.taxonomy-field__edit {
  position: absolute;
  right: 0.7em;
  top: 50%;
  margin-top: -1.2em;
  z-index: 2;
  @include text-small;
  cursor: pointer;
  border-radius: $border-radius;
  background: $color-gray;
  padding: $size-s;
}

.taxonomy-field__description {
  @include text-small;
  margin: $size-xxs;
  opacity: 0.5;
  margin-bottom: $size-s;
}

.taxonomy-field__selected-terms {
  padding: $size-s;
  padding-bottom: 0px;
  cursor: pointer;
  overflow-y: auto;

  &--open {
    @include elevated;
    cursor: default;
    border-bottom: $border;
  }

  .taxonomy-field--as-select & {
    white-space: nowrap;
  }
}

.taxonomy-field__placeholder {
  padding: 1rem;
  background: $color-white;
  color: $color-text-light;
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;
  //border-bottom: $border;
  @include text-body;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .taxonomy-field--closed & {
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
  }
}

.taxonomy-field__choices {
  overflow: scroll;
  max-height: 200px;

  &--max {
    background: $color-gray;
  }

  &:last-child {
    border-bottom: none;
  }

  .taxonomy-field--as-select & {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 10;
    max-height: 200px;
    background: $color-white;
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    @include elevated-xxl;
  }
}

.taxonomy-field__term {
  @include text-small;
  &.selected {
    font-weight: 500;
    background: $color-white;
  }

  &:hover {
    background: $color-white;
  }
}

.taxonomy-field__term-label {
  padding: $size-s;
  border-bottom: $border;
  display: block;
  cursor: pointer;
}

.taxonomy-field__search-input {
  @include text-small;
  padding: $size-s;
  width: 100%;
  border: none;
  border-bottom: $border;
  cursor: text;
  color: $color-text-light;
  font-family: inherit;
  outline: none;
}

.loading {
  @include text-small;
}
</style>