import React from 'react'
import ClassesItems from 'components/attedance_system/Dashboard/Classes/ClassesItems'
const DepartmentClasses = ({ data, refetch, title, des }) => {
    return (
        <div>
            <h2 className="text-2xl text-center md:text-4xl font-bold m-2">{title}</h2>
            <h2 className="text-lg text-center md:text-xl font-bold m-2">{des}</h2>
            <ClassesItems data={data} refetch={refetch} />
        </div>
    )
}

export default DepartmentClasses
