import React from "react";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import dateHelper from "../helpers/dateHelper";
import { Box, Button } from "@mui/material";

export const statusMap = {
  waiting_for_confirmation: "ne pritje",
  confirmed: "konfirmuar",
  completed: "perfunduar",
  draft: "draft",
  canceled: "anulluar",
  refused: "refuzuar",
  "deleted by user after cancelation": "fshire nga perdoruesi pas anullimit",
  "deleted by user before confirmation":
    "fshire nga perdoruesi para konfirmimit",
};

const columns = [
  { header: "Emri", key: "name" },
  { header: "Fusha", key: "locationName" },
  { header: "Data (fillon)", key: "startDate" },
  { header: "Data (mbaron)", key: "endDate" },
  { header: "Çmimi", key: "price" },
  { header: "Tipi", key: "isUserReservation" },
  { header: "Statusi", key: "status" },
  { header: "I perhershem", key: "isWeekly" },
];

const workSheetName = "Rezervimet-1";
const workBookName = new Date().toISOString().split("T")[0];
const myInputId = "myInput";

export default function ExcelExport({ data }) {
  const workbook = new Excel.Workbook();

  const saveExcel = async () => {
    try {
      const myInput = document.getElementById(myInputId);
      const fileName = myInput.value || workBookName;

      // creating one worksheet in workbook
      const worksheet = workbook.addWorksheet(workSheetName);

      // add worksheet columns
      // each columns contains header and its mapping key from data
      worksheet.columns = columns;

      // updated the font for first row.
      worksheet.getRow(1).font = { bold: true };

      // loop through all of the columns and set the alignment with width.
      worksheet.columns.forEach((column) => {
        column.width = 20;
        column.alignment = { horizontal: "center" };
      });
      const dataClone = JSON.parse(JSON.stringify(data));
      // loop through data and add each one to worksheet
      dataClone.forEach((singleData) => {
        singleData.isUserReservation = singleData.isUserReservation
          ? "Po"
          : "Jo";
        singleData.status = statusMap[singleData.status];
        singleData.isWeekly = singleData.isWeekly ? "Po" : "Jo";
        singleData.startDate = dateHelper(singleData.startDate);
        singleData.endDate = dateHelper(singleData.endDate);
        worksheet.addRow(singleData);
      });

      // loop through all of the rows and set the outline style.
      worksheet.eachRow({ includeEmpty: false }, (row) => {
        // store each cell to currentCell
        const currentCell = row._cells;

        // loop through currentCell to apply border only for the non-empty cell of excel
        currentCell.forEach((singleCell) => {
          // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
          const cellAddress = singleCell._address;

          // apply border
          worksheet.getCell(cellAddress).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // write the content using writeBuffer
      const buf = await workbook.xlsx.writeBuffer();

      // download the processed file
      saveAs(new Blob([buf]), `${fileName}.xlsx`);
    } catch (error) {
      console.error("<<<ERRROR>>>", error);
      console.error("Something Went Wrong", error.message);
    } finally {
      // removing worksheet's instance to create new one
      workbook.removeWorksheet(workSheetName);
    }
  };

  return (
    <>
      <style>
        {`
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
            textAlign: center;
            display:none;
          }
           th, td { 
             padding: 4px;
           }
        `}
      </style>
      <div style={{ textAlign: "center" }}>
        <br />

        <Box p={1}>
          <Button variant="contained" onClick={saveExcel} id={myInputId}>
            Export
          </Button>
        </Box>

        <br />

        <div>
          <table style={{ margin: "0 auto" }}>
            <tr>
              {columns.map(({ header }) => {
                return <th>{header}</th>;
              })}
            </tr>

            {JSON.parse(JSON.stringify(data))
              .map((data) => {
                if (data.isUserReservation === 1) {
                  data.isUserReservation = "Nga aplikacioni";
                } else {
                  data.isUserReservation = "Nga sistemi";
                }
                data.isWeekly = data.isWeekly ? "Po" : "Jo";
                data.startDate = dateHelper(data.startDate);
                data.endDate = dateHelper(data.endDate);
                data.status = statusMap[data.status];
                return data;
              })
              .map((uniqueData) => {
                return (
                  <tr>
                    {Object.entries(uniqueData).map((eachData) => {
                      let value = eachData[1];

                      return <td>{value}</td>;
                    })}
                  </tr>
                );
              })}
          </table>
        </div>
      </div>
    </>
  );
}
