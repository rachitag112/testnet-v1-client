import {
  LineChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

const pdata = [
  {
    name: 'MongoDb',
    student: 11,
    fees: 120,
  },
  {
    name: 'Javascript',
    student: 15,
    fees: 12,
  },
  {
    name: 'PHP',
    student: 5,
    fees: 10,
  },
  {
    name: 'Java',
    student: 10,
    fees: 5,
  },
  {
    name: 'C#',
    student: 9,
    fees: 4,
  },
  {
    name: 'C++',
    student: 10,
    fees: 8,
  },
]

function LinedChart() {
  return (
    <div className='w-full z-10'>
      <h1 className='text-white font-bold text-3xl mx-auto'>Price History</h1>
      <ResponsiveContainer width='100%' aspect={2}>
        <LineChart width={1500} height={1000} data={pdata}>
          <XAxis dataKey='name' interval={'preserveStartEnd'} />
          <YAxis></YAxis>
          <Legend />
          <Tooltip />
          <Line dataKey='student' stroke='green' activeDot={{ r: 8 }} />
          <Line dataKey='fees' stroke='red' activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LinedChart
