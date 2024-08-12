import type {Ref} from 'vue';
import {usePagination} from 'vue-request';

export class PaginationService<T> {
    data: any;
    run: (...arg: any) => void;
    loading: Ref<boolean>;
    current: Ref<number>;
    pageSize: Ref<number>;

    constructor(queryData: any) {
        const {
            data,
            run,
            loading,
            current,
            pageSize,
        } = usePagination(queryData, {
            pagination: {
                currentKey: 'page',
                pageSizeKey: 'pageSize',
            },
        });
        this.data = data;
        this.run = run;
        this.loading = loading;
        this.current = current;
        this.pageSize = pageSize;
    }

    getDataSource() {
        return this.data.value?.data.list || []
    }

    getPagination() {
        return {
            total: this.data.value?.data.total,
            current: this.current.value,
            pageSize: this.pageSize.value,
            showSizeChanger: true,
            showTotal: (total: number) => {
                return `共 ${total} 条`
            }
        }
    }
}
