/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            // Статика виджета
            {
                source: '/widgets/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin',      value: '*' },
                    // { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Methods',     value: 'GET,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers',     value: 'Content-Type,Authorization' },
                ],
            },
            // // API виджета
            // {
            //     source: '/api/widgets/:path*',
            //     headers: [
            //         { key: 'Access-Control-Allow-Origin',      value: '*' },
            //         { key: 'Access-Control-Allow-Credentials', value: 'true' },
            //         { key: 'Access-Control-Allow-Methods',     value: 'GET,POST,PUT,PATCH,DELETE,OPTIONS' },
            //         { key: 'Access-Control-Allow-Headers',     value: 'Content-Type,Authorization' },
            //     ],
            // },
            // // Auth-роуты
            // {
            //     source: '/api/auth/:path*',
            //     headers: [
            //         { key: 'Access-Control-Allow-Origin',      value: '*' },
            //         { key: 'Access-Control-Allow-Credentials', value: 'true' },
            //         { key: 'Access-Control-Allow-Methods',     value: 'GET,POST,OPTIONS' },
            //         { key: 'Access-Control-Allow-Headers',     value: 'Content-Type,Authorization' },
            //     ],
            // },
        ];
    },

    webpack(config) {
        config.resolve.fallback = {
            ...(config.resolve.fallback || {}),
            oracledb: false,
            'pg-query-stream': false,
        };
        config.externals = [
            ...(config.externals || []),
            /knex/,
            /objection/,
        ];
        return config;
    },
};

export default nextConfig;
