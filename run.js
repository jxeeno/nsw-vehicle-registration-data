const axios = require('axios');
const fs = require('fs');
const moment = require('moment');

const ENDPOINT = 'https://wabi-australia-southeast-api.analysis.windows.net/public/reports/querydata?synchronous=true';
const RESOUCE_KEY = '1918deb7-f91f-425e-babf-396dcb57352c';

async function getValidLgas () {
    const {data} = await axios.post(ENDPOINT, {
        "version":"1.0.0",
        "queries": [{"Query": {"Commands": [{"SemanticQueryDataShapeCommand": {"Query": {"Version": 2,"From": [{"Name": "r","Entity": "Registration snapshot","Type": 0}],"Select": [{"Column": {"Expression": {"SourceRef": {"Source": "r"}},"Property": "Customer Address LGA"},"Name": "Registration snapshot.Customer Address LGA"}],"Where": [{"Condition": {"In": {"Expressions": [{"Column": {"Expression": {"SourceRef": {"Source": "r"}},"Property": "Snapshot Effective Date Filter"}}],"Values": [[{"Literal": {"Value": "'Latest date'"}}]]}}}]},"Binding": {"Primary": {"Groupings": [{"Projections": [0]}]},"DataReduction": {"DataVolume": 4,"Primary": {"Window": {"Count": 5000}}},"IncludeEmptyGroups": true,"Version": 1},"ExecutionMetricsKind": 1}}]},"QueryId": ""}],
        "cancelQueries": [],
        "modelId": 2951452
    }, {
        headers: {
            'X-Powerbi-Resourcekey': RESOUCE_KEY
        }
    })

    return data.results[0].result.data.dsr.DS[0].PH[0].DM0.map(v => v.G0);
}

async function getLatestDate(){
    const {data} = await axios.post(ENDPOINT, {
        "version":"1.0.0",
        "queries":[{"Query":{"Commands":[{"SemanticQueryDataShapeCommand":{"Query":{"Version":2,"From":[{"Name":"r","Entity":"Registration snapshot","Type":0}],"Select":[{"Measure":{"Expression":{"SourceRef":{"Source":"r"}},"Property":"Snapshot Effective Date Selected"},"Name":"Registration snapshot.Snapshot Effective Date Selected"}],"Where":[{"Condition":{"In":{"Expressions":[{"Column":{"Expression":{"SourceRef":{"Source":"r"}},"Property":"Snapshot Effective Date Filter"}}],"Values":[[{"Literal":{"Value":"'Latest date'"}}]]}}}]},"Binding":{"Primary":{"Groupings":[{"Projections":[0]}]},"DataReduction":{"DataVolume":3,"Primary":{"Top":{}}},"Version":1},"ExecutionMetricsKind":1}}]},"CacheKey":"{\"Commands\":[{\"SemanticQueryDataShapeCommand\":{\"Query\":{\"Version\":2,\"From\":[{\"Name\":\"r\",\"Entity\":\"Registration snapshot\",\"Type\":0}],\"Select\":[{\"Measure\":{\"Expression\":{\"SourceRef\":{\"Source\":\"r\"}},\"Property\":\"Snapshot Effective Date Selected\"},\"Name\":\"Registration snapshot.Snapshot Effective Date Selected\"}],\"Where\":[{\"Condition\":{\"In\":{\"Expressions\":[{\"Column\":{\"Expression\":{\"SourceRef\":{\"Source\":\"r\"}},\"Property\":\"Snapshot Effective Date Filter\"}}],\"Values\":[[{\"Literal\":{\"Value\":\"'Latest date'\"}}]]}}}]},\"Binding\":{\"Primary\":{\"Groupings\":[{\"Projections\":[0]}]},\"DataReduction\":{\"DataVolume\":3,\"Primary\":{\"Top\":{}}},\"Version\":1},\"ExecutionMetricsKind\":1}}]}","QueryId":"","ApplicationContext":{"DatasetId":"aa700f39-d638-4b5a-9f9a-cb1c0c025bb6","Sources":[{"ReportId":"e32f5ea0-e316-4713-a6b0-51f91ade3f59","VisualId":"ba0a908bec763bc34e9b"}]}}],
        "cancelQueries":[],
        "modelId": 2951452
    }, {
        headers: {
            'X-Powerbi-Resourcekey': RESOUCE_KEY
        }
    })

    return data.results[0].result.data.dsr.DS[0].PH[0].DM0[0].M0;
}

async function getValidSnapshotDates () {
    const {data} = await axios.post(ENDPOINT, {
        "version":"1.0.0",
        "queries":[{"Query":{"Commands":[{"SemanticQueryDataShapeCommand":{"Query":{"Version":2,"From":[{"Name":"r","Entity":"Registration snapshot","Type":0}],"Select":[{"Column":{"Expression":{"SourceRef":{"Source":"r"}},"Property":"Snapshot Effective Date Filter"},"Name":"Registration snapshot.Snapshot Effective Date Filter"}],"OrderBy":[{"Direction":2,"Expression":{"Column":{"Expression":{"SourceRef":{"Source":"r"}},"Property":"Snapshot Effective Date Filter"}}}]},"Binding":{"Primary":{"Groupings":[{"Projections":[0]}]},"DataReduction":{"DataVolume":3,"Primary":{"Window":{}}},"IncludeEmptyGroups":true,"Version":1},"ExecutionMetricsKind":1}}]},"QueryId":"","ApplicationContext":{"DatasetId":"aa700f39-d638-4b5a-9f9a-cb1c0c025bb6","Sources":[{"ReportId":"e32f5ea0-e316-4713-a6b0-51f91ade3f59","VisualId":"723c74df0c404ace486b"}]}}],
        "cancelQueries":[],
        "modelId":2951452
    }, {
        headers: {
            'X-Powerbi-Resourcekey': RESOUCE_KEY
        }
    })

    return data.results[0].result.data.dsr.DS[0].ValueDicts.D0;
}
async function getRegistrationsByMotivePowerForLga(lgaName, requestSnapshotDate, snapshotDate){
	const {data} = await axios.post(ENDPOINT, {
		"version": "1.0.0",
		"queries": [
			{
				"Query": {
					"Commands": [
						{
							"SemanticQueryDataShapeCommand": {
								"Query": {
									"Version": 2,
									"From": [
										{
											"Name": "r",
											"Entity": "Registration snapshot",
											"Type": 0
										},
										{
											"Name": "m",
											"Entity": "Measure table",
											"Type": 0
										}
									],
									"Select": [
										{
											"Column": {
												"Expression": {
													"SourceRef": {
														"Source": "r"
													}
												},
												"Property": "Vehicle Motive Power Type"
											},
											"Name": "Registration snapshot.Vehicle Motive Power Type"
										},
										{
											"Measure": {
												"Expression": {
													"SourceRef": {
														"Source": "m"
													}
												},
												"Property": "Count"
											},
											"Name": "Measure table.Count"
										}
									],
									"Where": [
										{
											"Condition": {
												"In": {
													"Expressions": [
														{
															"Column": {
																"Expression": {
																	"SourceRef": {
																		"Source": "r"
																	}
																},
																"Property": "Snapshot Effective Date Filter"
															}
														}
													],
													"Values": [
														[
															{
																"Literal": {
																	"Value": `'${requestSnapshotDate}'`
																}
															}
														]
													]
												}
											}
										},
										{
											"Condition": {
												"In": {
													"Expressions": [
														{
															"Column": {
																"Expression": {
																	"SourceRef": {
																		"Source": "r"
																	}
																},
																"Property": "Customer Address LGA"
															}
														}
													],
													"Values": [
														[
															{
																"Literal": {
																	"Value": `'${lgaName}'`
																}
															}
														]
													]
												}
											}
										}
									],
									"OrderBy": [
										{
											"Direction": 2,
											"Expression": {
												"Measure": {
													"Expression": {
														"SourceRef": {
															"Source": "m"
														}
													},
													"Property": "Count"
												}
											}
										}
									]
								},
								"Binding": {
									"Primary": {
										"Groupings": [
											{
												"Projections": [
													0,
													1
												]
											}
										]
									},
									"DataReduction": {
										"DataVolume": 4,
										"Primary": {
											"Window": {
												"Count": 5000
											}
										}
									},
									"SuppressedJoinPredicates": [
										2
									],
									"Version": 1
								},
								"ExecutionMetricsKind": 1
							}
						}
					]
				},
				"QueryId": "",
				"ApplicationContext": {
					"DatasetId": "aa700f39-d638-4b5a-9f9a-cb1c0c025bb6",
					"Sources": [
						{
							"ReportId": "e32f5ea0-e316-4713-a6b0-51f91ade3f59",
							"VisualId": "15446f605c4197796490"
						}
					]
				}
			}
		],
		"cancelQueries": [],
		"modelId": 2951452
	}, {
        headers: {
            'X-Powerbi-Resourcekey': RESOUCE_KEY
        }
    });

    const records = [];
    const results = data.results[0].result.data.dsr.DS[0].PH[0].DM0;
    results.forEach(result => {
        records.push({
            LGA_NAME: lgaName,
            SNAPSHOT_DATE: snapshotDate,
            VEHICLE_MOTIVE_POWER_TYPE: result.C[0],
            COUNT: Math.round(result.C[1])
        })
    });

    return records;
}

async function getForAllLgas () {
    const snapshotDates = (await getValidSnapshotDates());
    const lgaNames = (await getValidLgas());

    console.log({
        snapshotDates,
        lgaNames
    })

    for(const requestSnapshotDate of snapshotDates){
        let snapshotDate = requestSnapshotDate;
        if(requestSnapshotDate === 'Latest date'){
            snapshotDate = await getLatestDate();
        }

        // make it an ISO date
        snapshotDate = moment(snapshotDate, 'DD-MMM-YY').format('YYYY-MM-DD');

        const fname = `docs/data/${snapshotDate}.json`;
        if(!fs.existsSync(fname)){
            const rows = [];

            for(const lga of lgaNames){
                console.log(`Fetching ${snapshotDate}, ${lga}`)
                rows.push(...await getRegistrationsByMotivePowerForLga(lga, requestSnapshotDate, snapshotDate));
            }

            console.log(`Got ${rows.length} rows for ${snapshotDate}`)

            fs.writeFileSync(fname, JSON.stringify(rows));
        }else{
            console.log(`Skipping ${snapshotDate}, already exists`)
        }
    }
}

getForAllLgas();