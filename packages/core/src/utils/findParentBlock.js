export default function findParentBlock(block) {
    // Works for both kind of views, model or view

    const nicheId =
        typeof block.getAttribute !== 'undefined'
            ? block.getAttribute('uuid') || block.getAttribute('data-niche-uuid') || null
            : null;

    if (nicheId !== null) {
        return nicheId;
    }

    if (typeof block.parent !== 'undefined' && block.parent !== null) {
        return findParentBlock(block.parent);
    }

    return null;
}
