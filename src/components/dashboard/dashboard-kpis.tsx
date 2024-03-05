import React from 'react';
import { FiDollarSign } from 'react-icons/fi';
import { TfiReceipt } from 'react-icons/tfi';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboard } from '@/lib/dashboards';
import { formatCurrency } from '@/lib/utils';

export default function DashboardKpis({ dashboardPromise }: { dashboardPromise: ReturnType<typeof getDashboard> }) {
  const dashboard = React.use(dashboardPromise);

  return (
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
