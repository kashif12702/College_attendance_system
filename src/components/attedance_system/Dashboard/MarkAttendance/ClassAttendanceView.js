import React, { useEffect, useState } from 'react'
import jsPDF from 'jspdf';
import { FaFilePdf } from 'react-icons/fa';
import 'jspdf-autotable';
import collegeLogo from './../../common/collegeLogo'
import { useUser } from 'util/db';
import { useAuth } from 'util/auth';
import ClassAttendanceViewItem from './ClassAttendanceViewItem';

const ClassAttendanceView = ({ attendanceData, myClass }) => {
    const currentTime = new Date();
    const headCellStyles = "md:min-w-[140px] p-3 md:text-lg text-sm border-r-[1px] text-white text-center bg-red-800 text-sm md:text-lg"
    const auth = useAuth();
    const { data: userData } = useUser(auth?.user?.uid);
    function formatDate(inputDate) {
        let dateObj;

        if (typeof inputDate === 'string') {
            dateObj = new Date(inputDate);
        } else if (inputDate instanceof Date) {
            dateObj = inputDate;
        } else {
            throw new Error("Invalid input date format");
        }

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }
    function formatTime(inputDate) {
        const dateObject = new Date(inputDate);
        const formattedTime = dateObject.toLocaleTimeString([], { timeStyle: 'short' });
        return formattedTime
    }
    function generatePDF(data) {
        const doc = new jsPDF();
        const tableHeaders = ['Roll No', 'Name', 'Attendance', 'Phone Number'];
        const tableData = data?.map(item => [item.college_rollno, item.name, item.attendance, item.phone_number]);

        const pageWidth = doc.internal.pageSize.getWidth();
        const imageWidth = 20;
        const xCoordinate = (pageWidth - imageWidth) / 2;

        doc.addImage(collegeLogo, 'PNG', xCoordinate, 10, imageWidth, 23);
        doc.setFontSize(20);
        doc.text("Government Post Graduate College Jhang", doc.internal.pageSize.getWidth() / 2, 40, 'center');

        // Add content above the table
        doc.setFontSize(16);
        doc.text('Attendance Report', doc.internal.pageSize.getWidth() / 2, 50, 'center'); // Centered title

        doc.setFontSize(12);
        doc.text(`Subject: ${myClass?.class_name}`, 10, 60);
        doc.text(`Date: ${myDate}`, 10, 70);
        doc.text(`Department: ${myClass?.department}`, 10, 80);
        doc.text(`Session: ${myClass?.session}`, 10, 90);


        doc.autoTable({
            head: [tableHeaders],
            body: tableData,
            startY: 100,
        });

        doc.save('attendance_report.pdf');
    }

    const [myDate, setMyDate] = useState(formatDate(currentTime))
    const [myAttendance, setMyAttendance] = useState(attendanceData?.filter(i => { return formatDate(i.createdAt) === myDate }))
    useEffect(() => {
        setMyAttendance(attendanceData?.filter(i => { return formatDate(i.createdAt) === myDate }))
    }, [attendanceData])
    const handleAttendance = () => {
        setMyAttendance(attendanceData?.filter(i => { return formatDate(i.createdAt) === myDate }))
    }
    return (
        <div className='red-primary pb-10'>
            <h1 className="pt-10 pb-6 text-3xl text-center font-bold">
                Attendance
            </h1>
            <section className='flex space-x-2 justify-center my-4'>
                <input className='p-2 text-xl rounded-lg' type='date' value={myDate} onChange={(e) => { setMyDate(e.target.value) }} />
                <button className='red-button' onClick={handleAttendance}>Show Attendance</button>
            </section>
            <div className='flex justify-center'>
                <button className='white-button' onClick={() => { generatePDF(myAttendance) }}>Generate pdf <FaFilePdf className='inline-block ml-2' /> </button>
            </div>
            <main className="flex flex-col">
                <div className='flex flex-wrap justify-center space-x-6 pt-4 pb-2'>
                    <div className="flex space-x-2">
                        <h2 className="md:text-lg text-sm font-semibold text-red-700">
                            Subject:
                        </h2>
                        <h3 className="md:text-lg text-sm font-semibold">
                            {myClass?.class_name}
                        </h3>
                    </div>
                    <div className="flex space-x-2">
                        <h2 className="md:text-lg text-sm font-semibold text-red-700">
                            Students:
                        </h2>
                        <h3 className="md:text-lg text-sm font-semibold">
                            {myAttendance?.length}
                        </h3>
                    </div>
                    <div className="flex space-x-2">
                        <h2 className="md:text-lg text-sm font-semibold text-red-700">
                            Date:
                        </h2>
                        <h3 className="md:text-lg text-sm font-semibold">
                            {myDate}
                        </h3>
                    </div>
                    <div className="flex space-x-2">
                        <h2 className="md:text-lg text-sm font-semibold text-red-700">
                            Time:
                        </h2>
                        <h3 className="md:text-lg text-sm font-semibold">
                            {myAttendance?.[0]?.createdAt ? formatTime(myAttendance?.[0]?.createdAt) : "00:00"}
                        </h3>
                    </div>
                </div>
                <div className='flex flex-wrap justify-center space-x-6 pt-4 pb-2'>
                    <div className="flex space-x-2">
                        <h2 className="md:text-lg text-sm font-semibold text-red-700">
                            Present:
                        </h2>
                        <h3 className="md:text-lg text-sm font-semibold">
                            {myAttendance?.filter(i => { return i.attendance === "Present" })?.length}
                        </h3>
                    </div>
                    <div className="flex space-x-2">
                        <h2 className="md:text-lg text-sm font-semibold text-red-700">
                            Absent:
                        </h2>
                        <h3 className="md:text-lg text-sm font-semibold">
                            {myAttendance?.filter(i => { return i.attendance === "Absent" })?.length}
                        </h3>
                    </div>
                    <div className="flex space-x-2">
                        <h2 className="md:text-lg text-sm font-semibold text-red-700">
                            Leave:
                        </h2>
                        <h3 className="md:text-lg text-sm font-semibold">
                            {myAttendance?.filter(i => { return i.attendance === "Leave" })?.length}
                        </h3>
                    </div>
                </div>
                {["teacher"].includes(userData?.roleas)
                    &&
                    <h2 className='text-center text-red-800 mb-2'>Note: You can't edit attendance after 40 minutes</h2>
                }
            </main>
            <section className=' md:overflow-hidden overflow-x-scroll'>
                <table className='md:mx-auto'>
                    <thead>
                        <tr>
                            <td className={headCellStyles}>Roll No.</td>
                            <td className={headCellStyles}>Uni roll No.</td>
                            <td className={headCellStyles}>Name</td>
                            <td className={headCellStyles}>Attendance</td>
                            <td className={headCellStyles}>Phone Number</td>
                            <td className={headCellStyles}>Edit</td>
                        </tr>
                    </thead>
                    <tbody>
                        {myAttendance?.sort((a, b) => a.college_rollno - b.college_rollno)?.map((item, index) => {
                            const givenDate = new Date(item.createdAt);
                            givenDate?.setMinutes(givenDate.getMinutes() + 40);

                            return (
                                <ClassAttendanceViewItem
                                    key={index}
                                    item={item}
                                    currentTime={currentTime}
                                    givenDate={givenDate}
                                    handleAttendance={handleAttendance}
                                />
                            )
                        })
                        }
                    </tbody>
                </table>
                {
                    myAttendance?.length === 0 ?
                        <img src="/Images/no_data.png" className="w-24 opacity-25 mx-auto mt-10" />
                        : ""
                }
            </section>
        </div>
    )
}

export default ClassAttendanceView
