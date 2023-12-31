import React, { useState, useEffect } from 'react'
import Schedule from './Schedule'
import { Navigate } from 'react-router-dom'
import IUser from '../types/user.type'
import Events from './events/Events'
import { getCurrentUser } from './../services/auth.service';
import { auth, getCurrentEvents, getEvents } from '../services/event.service';

interface Event {
    classes: Object
}


const Home = () : JSX.Element => {
    const [currentEvents, setCurrentEvents] = useState<Event | undefined>(undefined);

    if (!getCurrentUser()) {
        return <Navigate to="/login" />
    }

    const set_events_fresh = async () => {
        await getEvents();
        setCurrentEvents(getCurrentEvents());
    }

    const check_refresh_date = (events : any) => {
        const first_day = Object.keys(events.classes)[0];
        const first_day_day = first_day.split('-')[2];

        const today = new Date();
        const one_week = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const one_week_s = one_week.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).split('/');
        
        if (parseInt(first_day_day) < parseInt(one_week_s[1])) {
            console.log(`Refreshing since starting day: ${first_day_day} is outdated`);
            return false;
        }

        return true;
    }

    useEffect(() => {
        const events = getCurrentEvents();

        if (events && check_refresh_date(events)) {
            setCurrentEvents(events);
        }
        else {
            const user = getCurrentUser();
            console.log(user);
            if (user.x_ltf_profile && user.x_ltf_ssoid) {
                set_events_fresh();
            }
        }
        
    }, [])

    return (
        <div>
            <h2>Scheduled Events</h2>
            <h2>Next Weeks Events</h2>
            {currentEvents ? <Events event_obj={currentEvents.classes}/> : <h3> Loading</h3> } 
        </div>
    );
}

export default Home;