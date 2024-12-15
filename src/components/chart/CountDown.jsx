import React, { useEffect, useState } from 'react'

export default function CountDown({ end }) {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [mins, setMins] = useState(0);
    const [secs, setSecs] = useState(0);

    const padNumber = (number) => {
        return (number < 10 ? "0" : "") + number.toString();
    }
    useEffect(() => {
        const timerId = setInterval(() => {
            const endTime = new Date(end);
            const currentTime = new Date();
            const timeDiff = endTime - currentTime;

            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            setDays(days);
            setHours(hours);
            setMins(minutes);
            setSecs(seconds);
        }, 1000);

        const endTime = new Date(end);
        const currentTime = new Date();

        if (currentTime >= endTime) {
            setDays(0);
            setHours(0);
            setMins(0);
            setSecs(0);
            clearInterval(timerId);
        }

        return () => {
            clearInterval(timerId);
        }
    }, [end])

    return (
        <div className='text-center flex items-center justify-center md:gap-3 gap-1'>
            <div className=''>
                <div className='bg-timer p-5 rounded-[10px] shadow-md md:text-[48px] text-[32px] !text-white mb-3'>{padNumber(days)}</div>
                <div className='md:text-[12px] text-[10px]'>DAYS</div>
            </div>
            <div className='mt-[-25px] md:mt-[-30px] md:text-[48px] text-[24px]'>:</div>
            <div className=''>
                <div className='bg-timer p-5 rounded-[10px] shadow-md md:text-[48px] text-[32px] !text-white mb-3'>{padNumber(hours)}</div>
                <div className='md:text-[12px] text-[10px]'>HOURS</div>
            </div>
            <div className='mt-[-25px] md:mt-[-30px] md:text-[48px] text-[24px]'>:</div>
            <div className=''>
                <div className='bg-timer p-5 rounded-[10px] shadow-md md:text-[48px] text-[32px] !text-white mb-3'>{padNumber(mins)}</div>
                <div className='md:text-[12px] text-[10px]'>MINUTES</div>
            </div>
            <div className='mt-[-25px] md:mt-[-30px] md:text-[48px] text-[24px]'>:</div>
            <div className=''>
                <div className='bg-timer p-5 rounded-[10px] shadow-md md:text-[48px] text-[32px] !text-white mb-3'>{padNumber(secs)}</div>
                <div className='md:text-[12px] text-[10px]'>SECONDS</div>
            </div>
        </div>
    )
}
