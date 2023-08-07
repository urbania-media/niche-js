export default function findParentBlock(block) {
    // Works for both kind of views, model or view
    const nicheId = block.getAttribute
        ? block.getAttribute('uuid') || block.getAttribute('data-niche-uuid')
        : null;
    if (nicheId !== null) {
        return nicheId;
    }
    if (block.parent) {
        return findParentBlock(block.parent);
    }
    return null;
}
