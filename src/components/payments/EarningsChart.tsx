 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 
 interface EarningsData {
   month: string;
   revenue: number;
   subscriptions: number;
   oneTime: number;
 }
 
 interface EarningsChartProps {
   data: EarningsData[];
 }
 
 export const EarningsChart = ({ data }: EarningsChartProps) => {
   return (
     <Card>
       <CardHeader className="pb-2">
         <div className="flex items-center justify-between">
           <CardTitle className="text-lg font-semibold">Earnings Overview</CardTitle>
           <Tabs defaultValue="bar" className="w-auto">
             <TabsList className="h-8">
               <TabsTrigger value="bar" className="text-xs px-3">Bar</TabsTrigger>
               <TabsTrigger value="line" className="text-xs px-3">Line</TabsTrigger>
               <TabsTrigger value="area" className="text-xs px-3">Area</TabsTrigger>
             </TabsList>
           </Tabs>
         </div>
       </CardHeader>
       <CardContent>
         <Tabs defaultValue="bar" className="w-full">
           <TabsContent value="bar" className="mt-0">
             <div className="h-[280px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                   <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                   <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `₹${v/1000}k`} />
                   <Tooltip
                     contentStyle={{
                       backgroundColor: 'hsl(var(--background))',
                       border: '1px solid hsl(var(--border))',
                       borderRadius: '8px',
                     }}
                     formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                   />
                   <Bar dataKey="subscriptions" name="Subscriptions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                   <Bar dataKey="oneTime" name="One-time" fill="hsl(var(--primary) / 0.5)" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </TabsContent>
           <TabsContent value="line" className="mt-0">
             <div className="h-[280px]">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                   <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                   <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `₹${v/1000}k`} />
                   <Tooltip
                     contentStyle={{
                       backgroundColor: 'hsl(var(--background))',
                       border: '1px solid hsl(var(--border))',
                       borderRadius: '8px',
                     }}
                     formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                   />
                   <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </TabsContent>
           <TabsContent value="area" className="mt-0">
             <div className="h-[280px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                   <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                   <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `₹${v/1000}k`} />
                   <Tooltip
                     contentStyle={{
                       backgroundColor: 'hsl(var(--background))',
                       border: '1px solid hsl(var(--border))',
                       borderRadius: '8px',
                     }}
                     formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                   />
                   <defs>
                     <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorRevenue)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </TabsContent>
         </Tabs>
         <div className="flex items-center justify-center gap-6 mt-4">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-primary" />
             <span className="text-sm text-muted-foreground">Subscriptions</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-primary/50" />
             <span className="text-sm text-muted-foreground">One-time</span>
           </div>
         </div>
       </CardContent>
     </Card>
   );
 };