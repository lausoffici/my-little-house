import React from 'react';
import { FiDollarSign } from 'react-icons/fi';
import { TfiReceipt } from 'react-icons/tfi';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboard } from '@/lib/dashboards';
import { getAllCurrentYearReceipts } from '@/lib/receipts';
import { formatCurrency } from '@/lib/utils';

import ReceiptsBarChart from './receipts-bar-chart';
import YearSelect from './year-select';

type Props = {
  dashboardPromise: ReturnType<typeof getDashboard>;
  receiptsPromise: ReturnType<typeof getAllCurrentYearReceipts>;
};

export default function DashboardKpis({ dashboardPromise, receiptsPromise }: Props) {
  const dashboard = React.use(dashboardPromise);
  const { receiptYears, receipts } = React.use(receiptsPromise);

  return (
    <div className='flex flex-col gap-6'>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        <KpiCard
          title='Ingresos Totales'
          value={formatCurrency(dashboard.totalAmount)}
          description='Total de ingresos del día'
        />
        <KpiCard
          title='Ingresos en Efectivo'
          value={formatCurrency(dashboard.totalCash)}
          description='Total de ingresos en efectivo del día'
        />
        <KpiCard
          title='Ingresos en Transferencia'
          value={formatCurrency(dashboard.totalTransfer)}
          description='Total de ingresos en transferencia del día'
        />
        <KpiCard
          title='Cantidad de Comprobantes'
          value={dashboard.receiptsCount.toString()}
          description='Cantidad de comprobantes emitidos en el día'
          icon={<TfiReceipt />}
        />
        <KpiCard
          title='Gastos Totales'
          value={formatCurrency(dashboard.totalExpenditure)}
          description='Total de salidas de la caja del día'
        />
        <KpiCard
          title='Saldo Total de Caja'
          value={formatCurrency(dashboard.currentBalance)}
          description='Saldo actual de caja del día'
        />
      </div>

      <Card className='w-full min-h-96 p-6'>
        <CardHeader className='p-0 pb-4 flex flex-row w-full justify-between items-center'>
          <CardTitle className='block w-fit'>Balance de ingresos</CardTitle>
          <YearSelect years={receiptYears} />
        </CardHeader>
        <ReceiptsBarChart receipts={receipts} />
      </Card>
    </div>
  );
}

function KpiCard({
  title,
  value,
  description,
  icon
}: {
  title: string;
  value: string;
  description: string;
  icon?: JSX.Element;
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon ? icon : <FiDollarSign />}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
}
