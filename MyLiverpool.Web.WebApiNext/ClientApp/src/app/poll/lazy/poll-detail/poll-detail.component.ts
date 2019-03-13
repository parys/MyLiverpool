import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { PollService } from "../../core";
import { RolesCheckedService } from "@app/+auth";
import { Poll } from "../../models";
import { PollChart } from "../../models/pollChart.model";

@Component({
    selector: "poll-detail",
    templateUrl: "./poll-detail.component.html",
})

export class PollDetailComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    public item: Poll = new Poll();
    public pollCharts: PollChart[] = [];

    view: any[] = [700, 400];

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'Population';

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    constructor(private pollService: PollService,
        public roles: RolesCheckedService,
        private route: ActivatedRoute) { }

    public ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.sub2 = this.pollService.getSingle(+params["id"])
                .subscribe((data: Poll) => {
                    this.item = data;
                    this.convertToChart();
                });
        });
    }

    public ngOnDestroy(): void {
        if (this.sub) { this.sub.unsubscribe(); }
        if (this.sub2) { this.sub2.unsubscribe(); }
    }


    onSelect(event: any): void {
        console.log(event);
    }

    private convertToChart(): void {
        for (let i = 0; i < this.item.answers.length; i++) {
            let pollChart = new PollChart();
            pollChart.name = this.item.answers[i].text;
            pollChart.value = 44 / 3.0;
            this.pollCharts.push(pollChart);
        }
        console.warn(this.pollCharts);
    }
}