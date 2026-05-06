// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 22-Oct-23   ATK        PLAT-3420   Graphics Database - to be moved to Graphics Service on the backend
// 15-Nov-23   ATK        PLAT-3583   Added RemoveDuplicates
// -------------------------------------------------------------------------------------

export default class IafSet {
    static Intersection(A, B) {
        const setA = new Set(A);
        const setB = new Set(B);
        return [...setA].filter(x => setB.has(x));
    }

    static Difference(A, B) {
        const setA = new Set(A);
        const setB = new Set(B);
        return [...setA].filter(x => !setB.has(x));
    }

    static symmetricalDifference(A, B) {
        const setA = new Set(A);
        const setB = new Set(B);
        return [...setA].filter(x => !setB.has(x))
            .concat([...setB].filter(x => !setA.has(x)));
    }

    static Union(A, B) {
        return [...new Set([...A, ...B])];
    }

    static RemoveDuplicates(A) {
        return [...new Set(A)];
    }
}
