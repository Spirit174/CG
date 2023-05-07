
const eGridDiv = document.getElementById("grid-container");
var rowData = [
]

export const gridOptions = {
    columnDefs: [
        { field: "x", resizable: true, width: 130 },
        { field: "y", resizable: true, width: 130 },
    ],

    defaultColDef: {filter: true},

    rowSelection: 'single',
    animateRows: true, 

    onCellClicked: params => {
        console.log('cell', params)
    },
    rowData: rowData,
};
new agGrid.Grid(eGridDiv, gridOptions);

export function undoDotTable(){
    let count = gridOptions.api.getDisplayedRowCount();
    let node = gridOptions.api.getRowNode(String(count - 1));
    node.setSelected(true);
    const sel = gridOptions.api.getSelectedRows();
    gridOptions.api.applyTransaction({remove: sel});
}