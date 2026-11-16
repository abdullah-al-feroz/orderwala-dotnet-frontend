// A staff can have several salary structure rows (one-to-many) - older ones are kept
// as history after being soft-deleted. Everything that displays or edits the salary
// uses the current one: the active row, or the newest row when nothing is active.

export const latestSalaryStructure = (staffSalaryStructures) => {
  const list = Array.isArray(staffSalaryStructures) ? staffSalaryStructures : [];
  if (list.length === 0) return {};

  const active = list.filter(item => !item.deletedAt);
  const pool = active.length > 0 ? active : list;

  return pool.reduce((latest, item) =>
    !latest || item.id > latest.id ? item : latest
  , null) || {};
};

export default latestSalaryStructure;