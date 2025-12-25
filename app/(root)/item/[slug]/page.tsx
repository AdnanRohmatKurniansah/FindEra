import React from 'react'
import { Metadata } from 'next';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { SlashIcon } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Detail Item "" | FindEra',
}

const ItemDetail = () => {
  return (
    <section className="py-10">
      <div className="mx-auto px-5 md:px-15">
        <Breadcrumb className='mb-5'>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href="/components">Components</Link>
                </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <div className="item-detail">
            
        </div>
      </div>
    </section>
  )
}

export default ItemDetail