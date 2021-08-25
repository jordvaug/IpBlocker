# Ip Blocker


## Description
An HTTP service built on Expressjs that can determine whether a given IP address is allowed or blocked. If the IP is determined to be blocked, the source of the block determination is provided.

## Running the Application
You will first need to create a .env file in the root directory and populate it with: REFRESH=<time> where <time> is the milliseconds in between refreshing the blocked IP list. The defaut value is equal to 24 hours.
    Start the express API with: 
    npm start


## Testing

### Unit Testing
    Unit Tests can be run with: 
    npm test

To start querying the API, start the application, and use curl:

curl --location --request GET 'http://localhost:3000/0.0.0.0' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'ip=0.0.0.0'


### Benchmark Testing
    Benchmark testing can be run against a running API with: 
    npm run bench

This will compare a benchmark run of the application against any changes made. The results on the right are the new run, and the arrows will point to the fastest run. More info can be found [here](https://github.com/mafintosh/nanobench).



## Design Considerations
### IP Storage Form
IP addresses in sources are stored in dotted decimal notation (e.g. "192.168.0.1"), but because the lists are fetched and stored in memory this presents challenges. Strings in JavaScript are 2 bytes per character, and dotted decimal notation addresses can contain up to 15 characters -meaning 30 bytes per address. To reduce storage costs, IP addresses are converted from dotted decimal notation strings to number form for 8 bytes each.


### Data Structures
 Given IP addresses in the block lists can come in the form of IPv4 addresses and IPv4 CIDR blocks, three data structures are used to hold the list. 
 
 An array of source strings holds all of the urls that were used to populate the block list; the array is used to map IPs to their sources. A single array of strings is used so that the urls only need to be stored once in memory instead of with every IP. 
 
 A map of <number, number> is used to hold all addresses loaded in the form of a single IPv4 address, with a number form IP and the index of the source of the block status. This provides a O(1) check for matching blocked IP addresses.
 
 Finally, CIDR blocks are converted to number form, with the minimum and maximum host stored in a node along with the index of the source. The nodes are used to build a binary search tree sorted on the minimum host of the CIDR block. This simplifies checking incoming IP addresses against banned CIDR blocks: The incoming address is converted to number form and compared against the minimum address of each node, if it is greater than the minimum and less than the maximum of a node then it is a match and the index of the source is returned. This provides a search and insert time complexity of O(log(n)).
 
### Refresh Sources
For simplicity sake, I used setInterval to refresh the blocked IP list on a schedule. With more specific useage information, I may have used a tool like node-cron to set the refresh to happen on a schedule off peak hours.

### Software Design Patterns
I opted to use a Singleton pattern on the list and tree containing the blocked IPs. This has reduced the space costs associated with the application given the size of the list and tree. Given the list only exists in application memory and only needs to be read from when checking IPs, this seemed like the best solution.