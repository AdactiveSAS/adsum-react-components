// @flow

class ClickController {
    constructor() {
        this.onClickEvent = null;
        this.firstIntersect = null;
    }

    getEvent() {
        return this.onClickEvent;
    }

    onClick(event) {
        this.onClickEvent = event;
        this.firstIntersect = null;
        /**
         * Do stuff
         * **/
    }

    getFirstIntersectObject() {
        const { intersects } = this.onClickEvent;

        if(this.firstIntersect === null) {
            if (intersects.length === 0) {
                this.firstIntersect = null;
            }

            const firstIntersect = intersects[0];
            if (firstIntersect && (firstIntersect.object.isBuilding || firstIntersect.object.isSpace)) {
                this.firstIntersect = firstIntersect.object;
            } else if (firstIntersect && firstIntersect.object.isLabel) {
                // Special label behavior
                const labelParent = firstIntersect.object.parent;
                if (labelParent.isBuilding || labelParent.isSpace) {
                    // Prefer select the parent
                    this.firstIntersect = labelParent;
                } else {
                    this.firstIntersect = firstIntersect.object;
                }
            } else {
                this.firstIntersect = null;
            }
        }
        return this.firstIntersect;

    }
}

const clickController = new ClickController();
export default clickController;
