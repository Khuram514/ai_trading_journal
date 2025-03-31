import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
    	extend: {
    		colors: {
    			background: 'var(--background)',
    			foreground: 'var(--foreground)',
    			primary: 'var(--primary)',
    			darkPrimary: 'var(--darkPrimary)',
    			secondary: 'var(--secondary)',
    			claude: 'var(--claude)',
    			claudeBackground: 'var(--claudeBackground)',
    			buy: 'var(--buy)',
    			buyWithOpacity: 'var(--buyOpacity)',
    			sell: 'var(--sell)',
    			sellWithOpacity: 'var(--sellOpacity)',
    			customBlue: 'var(--customBlue)',
    			customOrange: 'var(--customOrange)',
    			customYellow: 'var(--customYellow)'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
