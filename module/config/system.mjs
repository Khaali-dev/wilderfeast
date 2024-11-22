export const SYSTEM_ID = "wilderfeast";

export const STYLES = Object.freeze({
    mighty : {
        id: "mighty",
        label: "WILDERFEAST.STYLES.mighty.label",
    },
    precise : {
        id: "precise",
        label: "WILDERFEAST.STYLES.precise.label",
    },
    swift : {
        id: "swift",
        label: "WILDERFEAST.STYLES.swift.label",
    },
    tricky : {
        id: "tricky",
        label: "WILDERFEAST.STYLES.tricky.label",
    },
});

export const SKILLS = Object.freeze({
    assurance: {
        id: "assurance",
        label: "WILDERFEAST.SKILLS.assurance.label"
    },
    call: {
        id: "call",
        label: "WILDERFEAST.SKILLS.call.label"
    },
    craft: {
        id: "craft",
        label: "WILDERFEAST.SKILLS.craft.label"
    },
    cure: {
        id: "cure",
        label: "WILDERFEAST.SKILLS.cure.label"
    },
    display: {
        id: "display",
        label: "WILDERFEAST.SKILLS.display.label"
    },
    grab: {
        id: "grab",
        label: "WILDERFEAST.SKILLS.grab.label"
    },
    hoard: {
        id: "hoard",
        label: "WILDERFEAST.SKILLS.hoard.label"
    },
    search: {
        id: "search",
        label: "WILDERFEAST.SKILLS.search.label"
    },
    shot: {
        id: "shot",
        label: "WILDERFEAST.SKILLS.shot.label"
    },
    strike: {
        id: "strike",
        label: "WILDERFEAST.SKILLS.strike.label"
    },
    study: {
        id: "study",
        label: "WILDERFEAST.SKILLS.study.label"
    },
    traversal: {
        id: "traversal",
        label: "WILDERFEAST.SKILLS.traversal.label"
    }
})

/**
 * Include all constant definitions within the SYSTEM global export
 * @type {Object}
 */
export const SYSTEM = {
  id: SYSTEM_ID,
  STYLES,
  SKILLS
};
