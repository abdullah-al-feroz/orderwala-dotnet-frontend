import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import $ from "jquery";

const DatatableWithoutExport = () => {
  if (!$.fn.DataTable.isDataTable("#myTable")) {
    // $(document).ready(function () {
    setTimeout(function () {
      $(".datatable").DataTable({
        bDestroy: true,
        columnDefs: [
          {
            defaultContent: "-",
            targets: "_all",
          },
        ],
        // pagingType: "full_numbers",
        pagingType: "numbers",
        pageLength: 2,
        processing: true,
        dom: "Bfrtip",
        select: {
          style: "single",
        },
        ordering: false,
        buttons: [
          {
            extend: "copy",
            className: "btn btn-dark bg-dark",
          },
          {
            extend: "csv",
            className: "btn btn-dark bg-dark",
          },
          {
            extend: "print",
            customize: function (win) {
              $(win.document.body).css("font-size", "10pt");
              $(win.document.body)
                .find("table")
                .addClass("compact")
                .css("font-size", "inherit");
            },
            className: "btn btn-dark bg-dark",
          },
        ],

        // fnRowCallback: function (
        //   nRow,
        //   aData,
        //   iDisplayIndex,
        //   iDisplayIndexFull
        // ) {
        //   var index = iDisplayIndexFull + 1;
        //   $("td:first", nRow).html(index);
        //   return nRow;
        // },

        lengthMenu: [
          [10, 20, 30, 50, -1],
          [10, 20, 30, 50, "All"],
        ],
        columnDefs: [
          {
            targets: 0,
            render: function (data, type, row, meta) {
              return type === "export" ? meta.row + 1 : data;
            },
          },
        ],
      });
    }, 1000);
    // });
  }
};

export default DatatableWithoutExport;
