// @flow

class ClickController {
    getFirstIntersectObject(event) {
        const { intersects } = event;

        let firstIntersect = intersects[0];
        if (firstIntersect && firstIntersect.object) {
            if (firstIntersect.object.isBuilding || firstIntersect.object.isSpace) {
                firstIntersect = firstIntersect.object;
            } else if (firstIntersect.object.isLabel) {
                // Special label behavior
                const labelParent = firstIntersect.object.parent;
                if (labelParent.isBuilding || labelParent.isSpace) {
                    // Prefer select the parent
                    firstIntersect = labelParent;
                } else {
                    firstIntersect = firstIntersect.object;
                }
            }
        }

        return firstIntersect;
    }
}

const clickController = new ClickController();
export default clickController;
