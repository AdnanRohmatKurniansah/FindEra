"use client"

import React from "react"

interface SummaryCardProps {
  label: string
  value: number
  bgColor: string
  textColor: string
  iconBg: string
  icon: React.ReactNode
}

const SummaryCard = ({
  label,
  value,
  bgColor,
  textColor,
  iconBg,
  icon,
}: SummaryCardProps) => {
  return (
    <div className="relative">
      <div
        className={`flex justify-between gap-4 rounded-[10px] shadow-sm px-4 py-4 transition-all duration-200 hover:scale-105 hover:shadow-md ${bgColor}`}
      >
        <div>
          <span className="text-gray-500 text-[14px]">{label}</span>
          <h5 className={`text-[14px] md:text-[16px] mt-1 md:mt-0 ${textColor}`}>{value}</h5>
        </div>
        <div className="icon">
          <div className={`rounded-[10px] p-2 md:p-3 ${iconBg} text-white`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard
