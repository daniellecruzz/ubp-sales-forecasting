from rest_framework.decorators import api_view
from rest_framework.response import Response
from sales.models import SalesRecord
import pandas as pd
import numpy as np
from datetime import timedelta

def get_sales_dataframe(period):
    records = SalesRecord.objects.values('date', 'total_amount')
    df = pd.DataFrame(records)
    if df.empty:
        return None
    df['date'] = pd.to_datetime(df['date'])
    df['total_amount'] = pd.to_numeric(df['total_amount'])
    if period == 'weekly':
        df = df.groupby(pd.Grouper(key='date', freq='W'))['total_amount'].sum().reset_index()
    else:
        df = df.groupby(pd.Grouper(key='date', freq='ME'))['total_amount'].sum().reset_index()
    df = df[df['total_amount'] > 0]
    return df

def calculate_metrics(actual, predicted):
    actual = np.array(actual, dtype=float)
    predicted = np.array(predicted, dtype=float)
    mape = np.mean(np.abs((actual - predicted) / actual)) * 100
    rmse = np.sqrt(np.mean((actual - predicted) ** 2))
    return round(mape, 2), round(rmse, 2)

@api_view(['GET'])
def forecast(request):
    model_type = request.GET.get('model', 'prophet')
    period = request.GET.get('period', 'weekly')

    df = get_sales_dataframe(period)
    if df is None or len(df) < 3:
        return Response({'error': 'Not enough data'}, status=400)

    train = df[:-2]
    test = df[-2:]

    try:
        if model_type == 'prophet':
            result = run_prophet(train, test, period)
        elif model_type == 'ets':
            result = run_ets(train, test, period)
        else:
            result = run_sarima(train, test, period)
        return Response(result)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

def run_prophet(train, test, period):
    from prophet import Prophet
    train_df = train.rename(columns={'date': 'ds', 'total_amount': 'y'})
    m = Prophet()
    m.fit(train_df)
    periods = 4 if period == 'weekly' else 3
    future = m.make_future_dataframe(periods=periods, freq='W' if period == 'weekly' else 'ME')
    forecast_df = m.predict(future)
    predicted = forecast_df['yhat'].values[-len(test):]
    actual = test['total_amount'].values
    mape, rmse = calculate_metrics(actual, predicted)
    chart_data = []
    for i, row in train.iterrows():
        chart_data.append({'date': str(row['date'].date()), 'actual': round(float(row['total_amount']), 2), 'forecast': None})
    for i, row in test.iterrows():
        pred = forecast_df[forecast_df['ds'] == row['date']]['yhat'].values
        chart_data.append({'date': str(row['date'].date()), 'actual': round(float(row['total_amount']), 2),
                          'forecast': round(float(pred[0]), 2) if len(pred) > 0 else None})
    future_dates = forecast_df['ds'].values[-periods:]
    forecast_data = [{'date': str(pd.Timestamp(d).date()), 'forecast': round(float(v), 2)}
                    for d, v in zip(future_dates, forecast_df['yhat'].values[-periods:])]
    return {'model': 'prophet', 'mape': mape, 'rmse': rmse, 'chart_data': chart_data, 'forecast_data': forecast_data}

def run_ets(train, test, period):
    from statsmodels.tsa.holtwinters import ExponentialSmoothing
    y = train['total_amount'].values
    model = ExponentialSmoothing(y, trend='add', seasonal=None)
    fit = model.fit()
    periods = 4 if period == 'weekly' else 3
    predicted_test = fit.forecast(len(test))
    actual = test['total_amount'].values
    mape, rmse = calculate_metrics(actual, predicted_test)
    chart_data = []
    for i, row in train.iterrows():
        chart_data.append({'date': str(row['date'].date()), 'actual': round(float(row['total_amount']), 2), 'forecast': None})
    for i, (idx, row) in enumerate(test.iterrows()):
        chart_data.append({'date': str(row['date'].date()), 'actual': round(float(row['total_amount']), 2),
                          'forecast': round(float(predicted_test[i]), 2)})
    future_forecast = fit.forecast(periods)
    freq = timedelta(weeks=1) if period == 'weekly' else timedelta(days=30)
    forecast_data = [{'date': str((test['date'].max() + freq * (i+1)).date()),
                     'forecast': round(float(v), 2)} for i, v in enumerate(future_forecast)]
    return {'model': 'ets', 'mape': mape, 'rmse': rmse, 'chart_data': chart_data, 'forecast_data': forecast_data}

def run_sarima(train, test, period):
    from statsmodels.tsa.statespace.sarimax import SARIMAX
    y = train['total_amount'].values
    model = SARIMAX(y, order=(1,1,1), seasonal_order=(0,0,0,0))
    fit = model.fit(disp=False)
    periods = 4 if period == 'weekly' else 3
    predicted_test = fit.forecast(len(test))
    actual = test['total_amount'].values
    mape, rmse = calculate_metrics(actual, predicted_test)
    chart_data = []
    for i, row in train.iterrows():
        chart_data.append({'date': str(row['date'].date()), 'actual': round(float(row['total_amount']), 2), 'forecast': None})
    for i, (idx, row) in enumerate(test.iterrows()):
        chart_data.append({'date': str(row['date'].date()), 'actual': round(float(row['total_amount']), 2),
                          'forecast': round(float(predicted_test[i]), 2)})
    future_forecast = fit.forecast(periods)
    freq = timedelta(weeks=1) if period == 'weekly' else timedelta(days=30)
    forecast_data = [{'date': str((test['date'].max() + freq * (i+1)).date()),
                     'forecast': round(float(v), 2)} for i, v in enumerate(future_forecast)]
    return {'model': 'sarima', 'mape': mape, 'rmse': rmse, 'chart_data': chart_data, 'forecast_data': forecast_data}