<template>
  <div class="taxonomy-list" v-if="getTaxonomies">
    <Tag
      v-for="term in getSelected"
      v-if="term !== undefined"
      @click="clickOnTag(term._id)"
      :color="tagType"
      :label="term.name.fr"
      :size="tagSize"
      :key="term._id"
      :icon="icon"
      :cliquable="cliquable"
      :hasHover="hover"
      class="taxonomy-list__tag"
    />

    <Loading type="standalone" v-else></Loading>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Loading from "../loading";
import Tag from "../../atoms/tag/tag.vue";

export default {
  name: "TaxonomyList",
  components: { Tag, Loading },
  props: {
    taxonomy: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    tagType: {
      type: String,
      required: false,
      default: "default",
      validator: function (value) {
        return ["default", "main"].indexOf(value) !== -1;
      },
      // main or default
    },
    tagSize: {
      type: String,
      required: false,
      default: "medium",
      validator: function (value) {
        return ["medium", "small"].indexOf(value) !== -1;
      },
    },
    selectedTerms: {
      required: false,
    },
    shortName: {
      type: Boolean,
      required: false,
    },
    cliquable: {
      type: Boolean,
      require: false,
      default: false,
    },
    hover: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters("taxonomies", [
      "getTaxonomies",
      "getTaxonomy",
      "getTaxonomiesSettings",
    ]),

    getSelected: function () {
      if (!Array.isArray(this.selectedTerms)) return [this.selectedTerms];

      return this.selectedTerms;
    },
  },
  methods: {
    ...mapActions({}),
    clickOnTag: function (id) {
      this.$emit("tagClick", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.taxonomy-list__tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>