import React from 'react';
import Head from 'next/head';
import c from "@constants/Common";
import Layout from "@components/Layout";
const Dashboard = () => {
    return (
        <React.Fragment>
            <Head>
                <meta charset="utf-8"/>
                <title>{`Dashboard - ${c.APP_NAME}`}</title>
            </Head>
            <Layout page="dashboard"></Layout>
        </React.Fragment>
    );
}
export default Dashboard;