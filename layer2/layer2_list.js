const axios = require('axios');
const Table = require('cli-table3');
const fs = require('fs');
require('dotenv').config(); // Memuat variabel lingkungan dari file .env

const apiKey = process.env.COINMARKETCAP_API_KEY; // Mengambil kunci API dari .env

async function ambilDataLayer2() {
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
        const params = {
                start: 1,
                        limit: 50, // Ambil lebih banyak data untuk memfilter Layer 2
                                convert: "USD"
                                    };
                                        
                                            try {
                                                    const response = await axios.get(url, {
                                                                params,
                                                                            headers: {
                                                                                            'X-CMC_PRO_API_KEY': apiKey
                                                                                                        }
                                                                                                                });
                                                                                                                        return response.data.data;
                                                                                                                            } catch (error) {
                                                                                                                                    console.error("Error mengambil data: ", error);
                                                                                                                                        }
                                                                                                                                        }

                                                                                                                                        function filterLayer2(data) {
                                                                                                                                            const layer2Keywords = ["Arbitrum", "Optimism", "zkSync", "StarkNet", "Polygon"]; // Tambahkan nama Layer 2 yang relevan di sini
                                                                                                                                                return data.filter(coin => layer2Keywords.some(keyword => coin.name.includes(keyword)));
                                                                                                                                                }

                                                                                                                                                function tampilkanDataLayer2(data) {
                                                                                                                                                    const table = new Table({
                                                                                                                                                            head: ["Peringkat", "Nama", "Simbol", "Kapitalisasi Pasar", "Harga Saat Ini", "Volume 24 jam"],
                                                                                                                                                                    colWidths: [10, 20, 10, 20, 15, 15]
                                                                                                                                                                        });

                                                                                                                                                                            data.forEach((coin, index) => {
                                                                                                                                                                                    table.push([
                                                                                                                                                                                                index + 1,
                                                                                                                                                                                                            coin.name,
                                                                                                                                                                                                                        coin.symbol,
                                                                                                                                                                                                                                    `$${coin.quote.USD.market_cap.toLocaleString()}`,
                                                                                                                                                                                                                                                `$${coin.quote.USD.price.toLocaleString()}`,
                                                                                                                                                                                                                                                            `$${coin.quote.USD.volume_24h.toLocaleString()}`
                                                                                                                                                                                                                                                                    ]);
                                                                                                                                                                                                                                                                        });

                                                                                                                                                                                                                                                                            console.log(table.toString());

                                                                                                                                                                                                                                                                                return data.slice(0, 10).map((coin, index) => ({
                                                                                                                                                                                                                                                                                        rank: index + 1,
                                                                                                                                                                                                                                                                                                name: coin.name,
                                                                                                                                                                                                                                                                                                        symbol: coin.symbol,
                                                                                                                                                                                                                                                                                                                marketCap: coin.quote.USD.market_cap,
                                                                                                                                                                                                                                                                                                                        price: coin.quote.USD.price,
                                                                                                                                                                                                                                                                                                                                volume: coin.quote.USD.volume_24h
                                                                                                                                                                                                                                                                                                                                    }));
                                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                                    function buatReadme(data) {
                                                                                                                                                                                                                                                                                                                                        let content = `# Top 10 Ethereum Layer 2 Solutions\n\n`;
                                                                                                                                                                                                                                                                                                                                            content += `Berikut adalah daftar 10 solusi Layer 2 Ethereum teratas berdasarkan kapitalisasi pasar:\n\n`;
                                                                                                                                                                                                                                                                                                                                                content += `| Peringkat | Nama       | Simbol | Kapitalisasi Pasar | Harga Saat Ini | Volume 24 jam |\n`;
                                                                                                                                                                                                                                                                                                                                                    content += `|-----------|------------|--------|--------------------|----------------|---------------|\n`;

                                                                                                                                                                                                                                                                                                                                                        data.forEach(coin => {
                                                                                                                                                                                                                                                                                                                                                                content += `| ${coin.rank} | ${coin.name} | ${coin.symbol} | $${coin.marketCap.toLocaleString()} | $${coin.price.toLocaleString()} | $${coin.volume.toLocaleString()} |\n`;
                                                                                                                                                                                                                                                                                                                                                                    });

                                                                                                                                                                                                                                                                                                                                                                        fs.writeFileSync('README.md', content, 'utf8');
                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                        async function main() {
                                                                                                                                                                                                                                                                                                                                                                            const data = await ambilDataLayer2();
                                                                                                                                                                                                                                                                                                                                                                                if (data) {
                                                                                                                                                                                                                                                                                                                                                                                        const layer2Data = filterLayer2(data);
                                                                                                                                                                                                                                                                                                                                                                                                const top10Data = tampilkanDataLayer2(layer2Data);
                                                                                                                                                                                                                                                                                                                                                                                                        buatReadme(top10Data);
                                                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                                                                            main();